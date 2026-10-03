import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../sms/sms.service';
import { GonlineError } from '../sms/gonline.client';
import { SmsCampaignsService, SEND_CONFIRMATION } from './sms-campaigns.service';

function makeService(
  prisma: Partial<PrismaService>,
  smsService: Partial<SmsService>,
): SmsCampaignsService {
  return new SmsCampaignsService(
    prisma as PrismaService,
    smsService as SmsService,
  );
}

function makeFile(content: string): Express.Multer.File {
  return {
    buffer: Buffer.from(content),
    size: Buffer.byteLength(content),
  } as Express.Multer.File;
}

describe('SmsCampaignsService', () => {
  const smsCampaign = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };
  const smsCampaignRecipient = {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
  };
  const tx = { smsCampaign, smsCampaignRecipient };
  const prisma = {
    smsCampaign,
    smsCampaignRecipient,
    $transaction: jest.fn(async (fn: (t: unknown) => Promise<unknown>) => fn(tx)),
  } as unknown as PrismaService;
  const smsService = {
    sendSms: jest.fn(),
    checkBalance: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('campaign CRUD', () => {
    it('creates a campaign with trimmed name/message', async () => {
      smsCampaign.create.mockResolvedValue({ id: 'c1', name: 'Welcome', message: 'Hi' });
      const service = makeService(prisma, smsService);

      await service.createCampaign({ name: '  Welcome  ', message: '  Hi  ' });

      expect(smsCampaign.create).toHaveBeenCalledWith({
        data: { name: 'Welcome', message: 'Hi' },
      });
    });
  });

  describe('importRecipients', () => {
    beforeEach(() => {
      smsCampaign.findUnique.mockResolvedValue({ id: 'c1' });
      smsCampaignRecipient.findMany.mockResolvedValue([]);
      smsCampaignRecipient.createMany.mockResolvedValue({ count: 1 });
      smsCampaignRecipient.count.mockResolvedValue(1);
      smsCampaign.update.mockResolvedValue({});
    });

    it('imports valid international numbers', async () => {
      const service = makeService(prisma, smsService);
      const result = await service.importRecipients(
        'c1',
        makeFile('phone\n+14155552671\n+233244000000'),
      );

      expect(result.added).toBe(2);
      expect(smsService.sendSms).not.toHaveBeenCalled();
    });

    it('rejects invalid numbers', async () => {
      const service = makeService(prisma, smsService);
      const result = await service.importRecipients(
        'c1',
        makeFile('phone\n+12345\nabc'),
      );

      expect(result.invalid).toBe(2);
      expect(result.added).toBe(0);
    });
  });

  describe('markReady / cancel', () => {
    it('marks a DRAFT campaign with pending recipients as READY', async () => {
      smsCampaign.findUnique.mockResolvedValue({
        id: 'c1',
        message: 'Hi',
        status: 'DRAFT',
      });
      smsCampaignRecipient.count.mockResolvedValue(1);
      smsCampaign.update.mockResolvedValue({ id: 'c1', status: 'READY' });
      const service = makeService(prisma, smsService);

      await service.markReady('c1');

      expect(smsCampaign.update).toHaveBeenCalledWith({
        where: { id: 'c1' },
        data: { status: 'READY' },
      });
    });

    it('rejects marking READY when there are no pending recipients', async () => {
      smsCampaign.findUnique.mockResolvedValue({
        id: 'c1',
        message: 'Hi',
        status: 'DRAFT',
      });
      smsCampaignRecipient.count.mockResolvedValue(0);
      const service = makeService(prisma, smsService);

      await expect(service.markReady('c1')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('cancels a DRAFT campaign', async () => {
      smsCampaign.findUnique.mockResolvedValue({ id: 'c1', status: 'DRAFT' });
      smsCampaign.update.mockResolvedValue({ id: 'c1', status: 'CANCELLED' });
      const service = makeService(prisma, smsService);

      await service.cancelCampaign('c1');

      expect(smsCampaign.update).toHaveBeenCalledWith({
        where: { id: 'c1' },
        data: { status: 'CANCELLED' },
      });
    });
  });

  describe('sendTestSms', () => {
    it('uses SmsService and does not touch recipients/counters', async () => {
      smsCampaign.findUnique.mockResolvedValue({
        id: 'c1',
        message: 'Hello',
      });
      smsService.sendSms.mockResolvedValue({ success: true, messageId: 'm1' });
      const service = makeService(prisma, smsService);

      const result = await service.sendTestSms('c1', '+233244000000');

      expect(smsService.sendSms).toHaveBeenCalledWith('+233244000000', 'Hello');
      expect(result.messageId).toBe('m1');
      expect(smsCampaignRecipient.createMany).not.toHaveBeenCalled();
      expect(smsCampaignRecipient.update).not.toHaveBeenCalled();
      expect(smsCampaign.update).not.toHaveBeenCalled();
    });
  });

  describe('sendCampaign', () => {
    function setupSendableCampaign() {
      smsCampaign.findUnique.mockResolvedValue({
        id: 'c1',
        message: 'Hello campaign',
        status: 'READY',
      });
      smsService.checkBalance.mockResolvedValue({ success: true, balance: '100' });
      smsCampaign.updateMany.mockResolvedValue({ count: 1 });
      smsCampaign.update.mockResolvedValue({});
      smsCampaignRecipient.update.mockResolvedValue({});
    }

    it('requires the exact confirmation string', async () => {
      setupSendableCampaign();
      const service = makeService(prisma, smsService);

      await expect(service.sendCampaign('c1', 'WRONG')).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(smsService.sendSms).not.toHaveBeenCalled();
    });

    it('rejects sending when there are no pending recipients', async () => {
      setupSendableCampaign();
      smsCampaignRecipient.count.mockResolvedValue(0);
      const service = makeService(prisma, smsService);

      await expect(
        service.sendCampaign('c1', SEND_CONFIRMATION),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects sending when balance is insufficient', async () => {
      setupSendableCampaign();
      smsService.checkBalance.mockResolvedValue({ success: true, balance: '1' });
      smsCampaignRecipient.count.mockResolvedValue(10);
      const service = makeService(prisma, smsService);

      await expect(
        service.sendCampaign('c1', SEND_CONFIRMATION),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(smsService.sendSms).not.toHaveBeenCalled();
    });

    it('rejects sending when the balance check fails', async () => {
      setupSendableCampaign();
      smsService.checkBalance.mockRejectedValue(new Error('no balance'));
      const service = makeService(prisma, smsService);

      await expect(
        service.sendCampaign('c1', SEND_CONFIRMATION),
      ).rejects.toBeInstanceOf(ServiceUnavailableException);
    });

    it('rejects when the campaign cannot be acquired (already SENDING)', async () => {
      setupSendableCampaign();
      smsCampaignRecipient.count.mockResolvedValue(1);
      smsCampaign.updateMany.mockResolvedValue({ count: 0 });
      smsCampaign.findUnique
        .mockResolvedValueOnce({
          id: 'c1',
          message: 'Hello campaign',
          status: 'READY',
        })
        .mockResolvedValueOnce({ status: 'SENDING' });
      const service = makeService(prisma, smsService);

      await expect(
        service.sendCampaign('c1', SEND_CONFIRMATION),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('rejects sending a CANCELLED campaign', async () => {
      setupSendableCampaign();
      smsCampaignRecipient.count.mockResolvedValue(1);
      smsCampaign.updateMany.mockResolvedValue({ count: 0 });
      smsCampaign.findUnique
        .mockResolvedValueOnce({
          id: 'c1',
          message: 'Hello campaign',
          status: 'READY',
        })
        .mockResolvedValueOnce({ status: 'CANCELLED' });
      const service = makeService(prisma, smsService);

      await expect(
        service.sendCampaign('c1', SEND_CONFIRMATION),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('sends only PENDING recipients and stores the provider message id', async () => {
      setupSendableCampaign();
      smsCampaignRecipient.count
        .mockResolvedValueOnce(1) // pending precondition
        .mockResolvedValueOnce(0) // final pending
        .mockResolvedValueOnce(1) // SENT count
        .mockResolvedValueOnce(0); // FAILED count
      smsCampaignRecipient.findMany
        .mockResolvedValueOnce([
          { id: 'r1', normalizedPhone: '+233244000000' },
        ])
        .mockResolvedValueOnce([]);
      smsService.sendSms.mockResolvedValue({
        success: true,
        messageId: 'msg123',
      });
      const service = makeService(prisma, smsService);

      const result = await service.sendCampaign('c1', SEND_CONFIRMATION);

      expect(result).toEqual({
        status: 'COMPLETED',
        sent: 1,
        failed: 0,
        pending: 0,
      });
      expect(smsCampaignRecipient.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { campaignId: 'c1', status: 'PENDING' } }),
      );
      expect(smsCampaignRecipient.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'SENT',
            providerMessageId: 'msg123',
          }),
        }),
      );
    });

    it('records a per-recipient failure and continues', async () => {
      setupSendableCampaign();
      smsCampaignRecipient.count
        .mockResolvedValueOnce(1) // pending precondition
        .mockResolvedValueOnce(0) // final pending
        .mockResolvedValueOnce(0) // SENT count
        .mockResolvedValueOnce(1); // FAILED count
      smsCampaignRecipient.findMany
        .mockResolvedValueOnce([{ id: 'r1', normalizedPhone: '+233244000000' }])
        .mockResolvedValueOnce([]);
      smsService.sendSms.mockRejectedValue(new GonlineError(103, 'Invalid phone number'));
      const service = makeService(prisma, smsService);

      const result = await service.sendCampaign('c1', SEND_CONFIRMATION);

      expect(result.failed).toBe(1);
      expect(smsCampaignRecipient.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'FAILED' }),
        }),
      );
    });

    it('stops the campaign on a system-level (global) failure', async () => {
      setupSendableCampaign();
      smsCampaignRecipient.count.mockResolvedValue(1);
      smsCampaignRecipient.findMany.mockResolvedValue([
        { id: 'r1', normalizedPhone: '+233244000000' },
      ]);
      smsService.sendSms.mockRejectedValue(
        new GonlineError(102, 'Authentication failed'),
      );
      const service = makeService(prisma, smsService);

      await expect(
        service.sendCampaign('c1', SEND_CONFIRMATION),
      ).rejects.toBeInstanceOf(GonlineError);
      // Campaign left in FAILED state.
      expect(smsCampaign.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: 'FAILED' } }),
      );
    });

    it('stops and marks FAILED when the DB update fails after the provider accepted', async () => {
      setupSendableCampaign();
      smsCampaignRecipient.count.mockResolvedValue(1);
      smsCampaignRecipient.findMany.mockResolvedValue([
        { id: 'r1', normalizedPhone: '+233244000000' },
      ]);
      smsService.sendSms.mockResolvedValue({ success: true, messageId: 'm1' });
      // Provider accepted, but the SENT persistence fails.
      smsCampaignRecipient.update.mockRejectedValue(new Error('db down'));
      const service = makeService(prisma, smsService);

      await expect(
        service.sendCampaign('c1', SEND_CONFIRMATION),
      ).rejects.toBeInstanceOf(ServiceUnavailableException);

      // The recipient is NOT incorrectly marked FAILED (outcome is ambiguous).
      expect(smsCampaignRecipient.update).not.toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'FAILED' }),
        }),
      );
      expect(smsCampaign.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: 'FAILED' } }),
      );
    });
  });
});
