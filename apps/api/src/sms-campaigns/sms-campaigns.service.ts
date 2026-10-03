import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSmsCampaignDto } from './dto/create-sms-campaign.dto';
import { UpdateSmsCampaignDto } from './dto/update-sms-campaign.dto';
import { normalizePhone } from '../sms/phone.util';
import { parseCsv, findPhoneColumn } from './csv.util';

const DEFAULT_LIMIT = 20;
export const MAX_CSV_FILE_SIZE = 1024 * 1024; // 1MB
export const MAX_CSV_ROWS = 10000;

export interface ImportRecipientsResult {
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
  added: number;
}

/**
 * SMS campaign management foundation.
 *
 * Phase 1 manages campaign metadata; Phase 2A adds contact import/review.
 * Sending is intentionally not implemented yet — it will reuse SmsService /
 * GOnlineClient in a later phase.
 */
@Injectable()
export class SmsCampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCampaigns(query: { page?: string; limit?: string }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(query.limit) || DEFAULT_LIMIT),
    );
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.smsCampaign.count(),
      this.prisma.smsCampaign.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { recipients: true } } },
      }),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getCampaign(id: string) {
    const campaign = await this.prisma.smsCampaign.findUnique({
      where: { id },
      include: { _count: { select: { recipients: true } } },
    });

    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async createCampaign(data: CreateSmsCampaignDto) {
    return this.prisma.smsCampaign.create({
      data: {
        name: data.name.trim(),
        message: data.message.trim(),
      },
    });
  }

  async updateCampaign(id: string, data: UpdateSmsCampaignDto) {
    const existing = await this.prisma.smsCampaign.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Campaign not found');

    return this.prisma.smsCampaign.update({
      where: { id },
      data: {
        name: data.name?.trim() ?? undefined,
        message: data.message?.trim() ?? undefined,
      },
    });
  }

  async deleteCampaign(id: string) {
    const existing = await this.prisma.smsCampaign.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Campaign not found');

    await this.prisma.smsCampaign.delete({ where: { id } });
    return { success: true };
  }

  // ---- Recipients ----

  async importRecipients(
    campaignId: string,
    file: Express.Multer.File | undefined,
  ): Promise<ImportRecipientsResult> {
    const campaign = await this.prisma.smsCampaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');

    if (!file || !file.buffer) {
      throw new BadRequestException('No CSV file provided');
    }
    if (file.size > MAX_CSV_FILE_SIZE) {
      throw new BadRequestException('CSV file is too large (max 1MB)');
    }

    const parsed = parseCsv(file.buffer.toString('utf8'));
    if (parsed.headers.length === 0) {
      throw new BadRequestException('CSV file is empty');
    }
    if (parsed.rows.length > MAX_CSV_ROWS) {
      throw new BadRequestException(
        `CSV file has too many rows (max ${MAX_CSV_ROWS})`,
      );
    }

    const phoneColumn = findPhoneColumn(parsed.headers);
    if (phoneColumn === null) {
      throw new BadRequestException(
        'Could not find a phone-number column in the CSV',
      );
    }

    const dataRows = parsed.rows.filter(
      (row) => (row[phoneColumn] ?? '').trim() !== '',
    );
    const total = dataRows.length;

    const seen = new Set<string>();
    let valid = 0;
    let invalid = 0;
    let duplicates = 0;
    const candidates: { phoneNumber: string; normalizedPhone: string }[] = [];

    for (const row of dataRows) {
      const rawValue = (row[phoneColumn] ?? '').trim();
      const normalized = normalizePhone(rawValue);
      if (!normalized) {
        invalid++;
        continue;
      }
      valid++;
      if (seen.has(normalized)) {
        duplicates++;
        continue;
      }
      seen.add(normalized);
      candidates.push({ phoneNumber: rawValue, normalizedPhone: normalized });
    }

    // Deduplicate against recipients already in this campaign. Idempotent:
    // re-importing the same CSV never creates duplicate recipients.
    if (candidates.length > 0) {
      const existing = await this.prisma.smsCampaignRecipient.findMany({
        where: { campaignId, normalizedPhone: { in: [...seen] } },
        select: { normalizedPhone: true },
      });
      const existingSet = new Set(existing.map((e) => e.normalizedPhone));
      const newRecipients = candidates.filter(
        (c) => !existingSet.has(c.normalizedPhone),
      );
      duplicates += candidates.length - newRecipients.length;

      await this.prisma.$transaction(async (tx) => {
        await tx.smsCampaignRecipient.createMany({
          data: newRecipients.map((r) => ({ campaignId, ...r })),
        });
        await this.syncRecipientCount(tx, campaignId);
      });

      return {
        total,
        valid,
        invalid,
        duplicates,
        added: newRecipients.length,
      };
    }

    return { total, valid, invalid, duplicates, added: 0 };
  }

  async getRecipients(
    campaignId: string,
    query: { page?: string; limit?: string },
  ) {
    const campaign = await this.prisma.smsCampaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(query.limit) || DEFAULT_LIMIT),
    );
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.smsCampaignRecipient.count({ where: { campaignId } }),
      this.prisma.smsCampaignRecipient.findMany({
        where: { campaignId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async removeRecipient(campaignId: string, recipientId: string) {
    const recipient = await this.prisma.smsCampaignRecipient.findFirst({
      where: { id: recipientId, campaignId },
    });
    if (!recipient) throw new NotFoundException('Recipient not found');

    await this.prisma.$transaction(async (tx) => {
      await tx.smsCampaignRecipient.delete({ where: { id: recipientId } });
      await this.syncRecipientCount(tx, campaignId);
    });

    return { success: true };
  }

  async clearInvalidRecipients(campaignId: string) {
    const campaign = await this.prisma.smsCampaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');

    await this.prisma.$transaction(async (tx) => {
      await tx.smsCampaignRecipient.deleteMany({
        where: { campaignId, status: 'SKIPPED' },
      });
      await this.syncRecipientCount(tx, campaignId);
    });

    return { success: true };
  }

  async clearAllRecipients(campaignId: string) {
    const campaign = await this.prisma.smsCampaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');

    await this.prisma.$transaction(async (tx) => {
      await tx.smsCampaignRecipient.deleteMany({ where: { campaignId } });
      await this.syncRecipientCount(tx, campaignId);
    });

    return { success: true };
  }

  private async syncRecipientCount(
    tx: Prisma.TransactionClient,
    campaignId: string,
  ): Promise<void> {
    const count = await tx.smsCampaignRecipient.count({
      where: { campaignId },
    });
    await tx.smsCampaign.update({
      where: { id: campaignId },
      data: { recipientCount: count },
    });
  }
}
