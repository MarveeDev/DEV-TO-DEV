import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SmsCampaignsService } from './sms-campaigns.service';

function makeService(prisma: Partial<PrismaService>): SmsCampaignsService {
  return new SmsCampaignsService(prisma as PrismaService);
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
    delete: jest.fn(),
    count: jest.fn(),
  };
  const smsCampaignRecipient = {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    createMany: jest.fn(),
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('campaign CRUD', () => {
    it('creates a campaign with trimmed name/message', async () => {
      smsCampaign.create.mockResolvedValue({ id: 'c1', name: 'Welcome', message: 'Hi' });
      const service = makeService(prisma);

      await service.createCampaign({ name: '  Welcome  ', message: '  Hi  ' });

      expect(smsCampaign.create).toHaveBeenCalledWith({
        data: { name: 'Welcome', message: 'Hi' },
      });
    });

    it('returns a paginated campaign list', async () => {
      smsCampaign.count.mockResolvedValue(1);
      smsCampaign.findMany.mockResolvedValue([{ id: 'c1', name: 'Welcome' }]);
      const service = makeService(prisma);

      const result = await service.getCampaigns({ page: '1', limit: '20' });

      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(smsCampaign.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 20 }),
      );
    });

    it('throws NotFoundException when fetching a missing campaign', async () => {
      smsCampaign.findUnique.mockResolvedValue(null);
      const service = makeService(prisma);

      await expect(service.getCampaign('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('updates an existing campaign', async () => {
      smsCampaign.findUnique.mockResolvedValue({ id: 'c1' });
      smsCampaign.update.mockResolvedValue({ id: 'c1', name: 'New' });
      const service = makeService(prisma);

      await service.updateCampaign('c1', { name: ' New ' });

      expect(smsCampaign.update).toHaveBeenCalledWith({
        where: { id: 'c1' },
        data: { name: 'New', message: undefined },
      });
    });

    it('deletes an existing campaign', async () => {
      smsCampaign.findUnique.mockResolvedValue({ id: 'c1' });
      smsCampaign.delete.mockResolvedValue({ id: 'c1' });
      const service = makeService(prisma);

      const result = await service.deleteCampaign('c1');

      expect(smsCampaign.delete).toHaveBeenCalledWith({ where: { id: 'c1' } });
      expect(result).toEqual({ success: true });
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
      const service = makeService(prisma);
      const file = makeFile('phone\n+14155552671\n+233244000000');

      const result = await service.importRecipients('c1', file);

      expect(result).toEqual({
        total: 2,
        valid: 2,
        invalid: 0,
        duplicates: 0,
        added: 2,
      });
      expect(smsCampaignRecipient.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({ normalizedPhone: '+14155552671' }),
          expect.objectContaining({ normalizedPhone: '+233244000000' }),
        ]),
      });
    });

    it('normalizes Ghana local numbers', async () => {
      const service = makeService(prisma);
      const file = makeFile('phone\n0244000000');

      const result = await service.importRecipients('c1', file);

      expect(result.added).toBe(1);
      expect(smsCampaignRecipient.createMany).toHaveBeenCalledWith({
        data: [
          {
            campaignId: 'c1',
            phoneNumber: '0244000000',
            normalizedPhone: '+233244000000',
          },
        ],
      });
    });

    it('rejects invalid and ambiguous numbers', async () => {
      const service = makeService(prisma);
      const file = makeFile('phone\n+12345\nabc\n4155552671');

      const result = await service.importRecipients('c1', file);

      expect(result.invalid).toBe(3);
      expect(result.valid).toBe(0);
      expect(result.added).toBe(0);
      expect(smsCampaignRecipient.createMany).not.toHaveBeenCalled();
    });

    it('detects duplicates within the import', async () => {
      const service = makeService(prisma);
      const file = makeFile('phone\n+14155552671\n+14155552671');

      const result = await service.importRecipients('c1', file);

      expect(result.duplicates).toBe(1);
      expect(result.added).toBe(1);
    });

    it('detects duplicates against existing recipients', async () => {
      smsCampaignRecipient.findMany.mockResolvedValue([
        { normalizedPhone: '+14155552671' },
      ]);
      const service = makeService(prisma);
      const file = makeFile('phone\n+14155552671\n+442079460958');

      const result = await service.importRecipients('c1', file);

      expect(result.duplicates).toBe(1);
      expect(result.added).toBe(1);
    });

    it('rejects a multi-column CSV without a phone column', async () => {
      const service = makeService(prisma);
      const file = makeFile('name,email\nAlice,alice@x.com');

      await expect(service.importRecipients('c1', file)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('returns zero counts for a header-only CSV', async () => {
      const service = makeService(prisma);
      const file = makeFile('phone');

      const result = await service.importRecipients('c1', file);

      expect(result.total).toBe(0);
      expect(result.added).toBe(0);
      expect(smsCampaignRecipient.createMany).not.toHaveBeenCalled();
    });
  });

  describe('recipient management', () => {
    it('removes a recipient and keeps recipientCount accurate', async () => {
      smsCampaignRecipient.findFirst.mockResolvedValue({ id: 'r1' });
      smsCampaignRecipient.count.mockResolvedValue(0);
      const service = makeService(prisma);

      await service.removeRecipient('c1', 'r1');

      expect(smsCampaignRecipient.delete).toHaveBeenCalledWith({
        where: { id: 'r1' },
      });
      expect(smsCampaign.update).toHaveBeenCalledWith({
        where: { id: 'c1' },
        data: { recipientCount: 0 },
      });
    });

    it('throws NotFoundException when removing a missing recipient', async () => {
      smsCampaignRecipient.findFirst.mockResolvedValue(null);
      const service = makeService(prisma);

      await expect(service.removeRecipient('c1', 'missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('clears invalid (SKIPPED) recipients only', async () => {
      smsCampaign.findUnique.mockResolvedValue({ id: 'c1' });
      smsCampaignRecipient.deleteMany.mockResolvedValue({ count: 0 });
      smsCampaignRecipient.count.mockResolvedValue(2);
      const service = makeService(prisma);

      await service.clearInvalidRecipients('c1');

      expect(smsCampaignRecipient.deleteMany).toHaveBeenCalledWith({
        where: { campaignId: 'c1', status: 'SKIPPED' },
      });
    });

    it('clears all recipients', async () => {
      smsCampaign.findUnique.mockResolvedValue({ id: 'c1' });
      smsCampaignRecipient.deleteMany.mockResolvedValue({ count: 2 });
      smsCampaignRecipient.count.mockResolvedValue(0);
      const service = makeService(prisma);

      await service.clearAllRecipients('c1');

      expect(smsCampaignRecipient.deleteMany).toHaveBeenCalledWith({
        where: { campaignId: 'c1' },
      });
      expect(smsCampaign.update).toHaveBeenCalledWith({
        where: { id: 'c1' },
        data: { recipientCount: 0 },
      });
    });
  });
});
