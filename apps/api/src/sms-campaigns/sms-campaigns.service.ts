import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ServiceUnavailableException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSmsCampaignDto } from './dto/create-sms-campaign.dto';
import { UpdateSmsCampaignDto } from './dto/update-sms-campaign.dto';
import { normalizePhone } from '../sms/phone.util';
import { parseCsv, findPhoneColumn } from './csv.util';
import { estimateSmsUnits } from './sms-units.util';
import { SmsService } from '../sms/sms.service';
import { GonlineError } from '../sms/gonline.client';

const DEFAULT_LIMIT = 20;
export const MAX_CSV_FILE_SIZE = 1024 * 1024; // 1MB
export const MAX_CSV_ROWS = 10000;

export const SEND_CONFIRMATION = 'SEND CAMPAIGN';
export const SEND_BATCH_SIZE = 50;

/** Provider error codes that indicate a system-level failure (stop the send). */
const GLOBAL_ERROR_CODES = new Set([100, 102, 105, 106, 109]);

export interface ImportRecipientsResult {
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
  added: number;
}

export interface SendCampaignResult {
  status: string;
  sent: number;
  failed: number;
  pending: number;
}

/**
 * SMS campaign management.
 *
 * Recipient status semantics:
 * - PENDING: valid, eligible, not yet sent.
 * - SENT:    provider accepted and the result was persisted.
 * - FAILED:  provider rejected the send (not retried automatically).
 * - SKIPPED: valid but deliberately excluded (future suppression/opt-out).
 *
 * Invalid numbers are never persisted at all — they are reported during import
 * and discarded, which is intentionally distinct from SKIPPED.
 *
 * The send path reuses the existing SmsService/GOnlineClient. Delivery is
 * at-most-once from the campaign's perspective: because GOnline offers no
 * idempotency key, a provider "accepted" result that fails to persist is
 * treated as ambiguous (see processPendingRecipients) and is never auto-retried.
 */
@Injectable()
export class SmsCampaignsService {
  private readonly logger = new Logger(SmsCampaignsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly smsService: SmsService,
  ) {}

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

  // ---- Sending lifecycle ----

  async markReady(campaignId: string) {
    const campaign = await this.prisma.smsCampaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.status !== 'DRAFT') {
      throw new BadRequestException('Only DRAFT campaigns can be marked ready');
    }
    if (!campaign.message?.trim()) {
      throw new BadRequestException('Campaign has no message');
    }

    const pendingCount = await this.prisma.smsCampaignRecipient.count({
      where: { campaignId, status: 'PENDING' },
    });
    if (pendingCount === 0) {
      throw new BadRequestException('Campaign has no pending recipients');
    }

    return this.prisma.smsCampaign.update({
      where: { id: campaignId },
      data: { status: 'READY' },
    });
  }

  async cancelCampaign(campaignId: string) {
    const campaign = await this.prisma.smsCampaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.status !== 'DRAFT' && campaign.status !== 'READY') {
      throw new BadRequestException(
        'Campaign cannot be cancelled in its current state',
      );
    }

    return this.prisma.smsCampaign.update({
      where: { id: campaignId },
      data: { status: 'CANCELLED' },
    });
  }

  async getSendPreview(campaignId: string) {
    const campaign = await this.prisma.smsCampaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');

    const [recipientCount, pendingCount] = await Promise.all([
      this.prisma.smsCampaignRecipient.count({ where: { campaignId } }),
      this.prisma.smsCampaignRecipient.count({
        where: { campaignId, status: 'PENDING' },
      }),
    ]);

    return {
      id: campaign.id,
      name: campaign.name,
      message: campaign.message,
      status: campaign.status,
      recipientCount,
      pendingCount,
      sentCount: campaign.sentCount,
      failedCount: campaign.failedCount,
      estimatedUnits: pendingCount * estimateSmsUnits(campaign.message || ''),
      sendable:
        campaign.status === 'READY' &&
        pendingCount > 0 &&
        Boolean(campaign.message?.trim()),
    };
  }

  async sendTestSms(campaignId: string, phoneNumber: string) {
    const campaign = await this.prisma.smsCampaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (!campaign.message?.trim()) {
      throw new BadRequestException('Campaign has no message');
    }

    // Uses the existing SmsService; never touches recipients or counters.
    return this.smsService.sendSms(phoneNumber, campaign.message);
  }

  async sendCampaign(
    campaignId: string,
    confirmation: string,
  ): Promise<SendCampaignResult> {
    if (confirmation !== SEND_CONFIRMATION) {
      throw new BadRequestException('Invalid confirmation');
    }

    const campaign = await this.prisma.smsCampaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (!campaign.message?.trim()) {
      throw new BadRequestException('Campaign has no message');
    }

    // Balance safety — never begin sending if the balance check fails.
    let balance;
    try {
      balance = await this.smsService.checkBalance();
    } catch {
      throw new ServiceUnavailableException(
        'SMS balance check failed; campaign not sent',
      );
    }
    const pendingCount = await this.prisma.smsCampaignRecipient.count({
      where: { campaignId, status: 'PENDING' },
    });
    if (pendingCount === 0) {
      throw new BadRequestException('Campaign has no pending recipients');
    }
    const estimatedUnits = pendingCount * estimateSmsUnits(campaign.message);
    const numericBalance = Number(balance?.balance);
    if (!Number.isNaN(numericBalance) && numericBalance < estimatedUnits) {
      throw new BadRequestException(
        `Insufficient SMS balance (needs ~${estimatedUnits} units)`,
      );
    }

    // Concurrency protection: atomically acquire the campaign by moving it
    // from READY to SENDING. A second concurrent request finds 0 rows and is
    // rejected rather than double-sending.
    const acquired = await this.prisma.smsCampaign.updateMany({
      where: { id: campaignId, status: 'READY' },
      data: { status: 'SENDING' },
    });
    if (acquired.count === 0) {
      const current = await this.prisma.smsCampaign.findUnique({
        where: { id: campaignId },
        select: { status: true },
      });
      if (current?.status === 'SENDING') {
        throw new ConflictException('Campaign is already being sent');
      }
      throw new BadRequestException(
        'Campaign is not in a sendable state (must be READY)',
      );
    }

    try {
      const result = await this.processPendingRecipients(
        campaignId,
        campaign.message,
      );
      await this.syncCounters(campaignId);
      await this.prisma.smsCampaign.update({
        where: { id: campaignId },
        data: { status: 'COMPLETED' },
      });
      return { status: 'COMPLETED', ...result };
    } catch (e) {
      // System-level failure — leave the campaign in a clear FAILED state.
      await this.syncCounters(campaignId).catch(() => undefined);
      await this.prisma.smsCampaign
        .update({ where: { id: campaignId }, data: { status: 'FAILED' } })
        .catch(() => undefined);
      throw e;
    }
  }

  private async processPendingRecipients(
    campaignId: string,
    message: string,
  ): Promise<{ sent: number; failed: number; pending: number }> {
    let sent = 0;
    let failed = 0;

    // Controlled, sequential, small-batch processing. Only PENDING recipients
    // are ever selected, so SENT recipients can never be resent.
    //
    // NOTE — future suppression/opt-out extension point: a suppression check
    // would run here (or when importing) and mark a valid-but-suppressed
    // recipient as SKIPPED so it is excluded from the PENDING selection below.
    for (;;) {
      const batch = await this.prisma.smsCampaignRecipient.findMany({
        where: { campaignId, status: 'PENDING' },
        take: SEND_BATCH_SIZE,
        orderBy: { createdAt: 'asc' },
      });
      if (batch.length === 0) break;

      for (const recipient of batch) {
        let providerResult;
        try {
          providerResult = await this.smsService.sendSms(
            recipient.normalizedPhone,
            message,
          );
        } catch (e) {
          // Provider rejected the send. Record FAILED and continue, unless it
          // is a system-level failure that should stop the whole campaign.
          failed++;
          await this.prisma.smsCampaignRecipient
            .update({
              where: { id: recipient.id },
              data: { status: 'FAILED', error: this.safeError(e) },
            })
            .catch(() => undefined);
          if (this.isGlobalFailure(e)) {
            throw e;
          }
          continue;
        }

        // Provider accepted the message. Persist SENT. If persistence fails we
        // are inside the external-provider ambiguity window: the SMS may
        // already be delivered, but we cannot know. We must NOT retry it.
        try {
          await this.prisma.smsCampaignRecipient.update({
            where: { id: recipient.id },
            data: {
              status: 'SENT',
              providerMessageId: providerResult.messageId ?? null,
              sentAt: new Date(),
              error: null,
            },
          });
          sent++;
        } catch {
          this.logger.error(
            `Provider accepted SMS for recipient ${recipient.id} but persistence failed; outcome is ambiguous (at-most-once delivery preserved)`,
          );
          throw new ServiceUnavailableException(
            'SMS was accepted by the provider but could not be recorded; campaign stopped to avoid duplicate sends',
          );
        }
      }
    }

    const pending = await this.prisma.smsCampaignRecipient.count({
      where: { campaignId, status: 'PENDING' },
    });
    return { sent, failed, pending };
  }

  private async syncCounters(campaignId: string): Promise<void> {
    const [sentCount, failedCount] = await Promise.all([
      this.prisma.smsCampaignRecipient.count({
        where: { campaignId, status: 'SENT' },
      }),
      this.prisma.smsCampaignRecipient.count({
        where: { campaignId, status: 'FAILED' },
      }),
    ]);
    await this.prisma.smsCampaign.update({
      where: { id: campaignId },
      data: { sentCount, failedCount },
    });
  }

  private isGlobalFailure(e: unknown): boolean {
    if (e instanceof GonlineError) {
      if (e.code === null) return true;
      return GLOBAL_ERROR_CODES.has(e.code);
    }
    // Non-provider errors (e.g. database failures) are treated as system-level.
    return true;
  }

  private safeError(e: unknown): string {
    if (e instanceof GonlineError) return e.message;
    if (e instanceof Error) return e.message;
    return 'SMS sending failed';
  }
}
