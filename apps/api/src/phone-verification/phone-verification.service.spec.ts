import {
  BadRequestException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../sms/sms.service';
import { RedisService } from '../redis/redis.service';
import {
  PhoneVerificationService,
  OTP_MAX_ATTEMPTS,
  OTP_SEND_DAILY_LIMIT,
} from './phone-verification.service';

const PHONE = '+233244000000';

function makeService(
  prisma: Partial<PrismaService>,
  smsService: Partial<SmsService>,
  redisService: Partial<RedisService>,
): PhoneVerificationService {
  return new PhoneVerificationService(
    prisma as PrismaService,
    smsService as SmsService,
    redisService as RedisService,
  );
}

function freshMocks() {
  const phoneVerification = {
    findFirst: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn(),
    update: jest.fn(),
  };
  const user = { update: jest.fn() };
  const prisma = {
    phoneVerification,
    user,
    $transaction: jest.fn(async (ops: unknown[]) => {
      for (const op of ops) await op;
    }),
  };
  const smsService = { sendSms: jest.fn() };
  const redis = {
    set: jest.fn(),
    eval: jest.fn(),
  };

  phoneVerification.deleteMany.mockResolvedValue({ count: 0 });
  phoneVerification.create.mockResolvedValue({ id: 'r1' });
  phoneVerification.update.mockResolvedValue({ id: 'r1' });
  user.update.mockResolvedValue({ id: 'u1' });
  smsService.sendSms.mockResolvedValue({ success: true });
  redis.set.mockResolvedValue('OK');
  redis.eval.mockResolvedValue(1);

  const redisService = { getClient: () => redis };
  return { prisma, phoneVerification, user, smsService, redis, redisService };
}

async function sendAndCaptureOtp(
  service: PhoneVerificationService,
  smsService: { sendSms: jest.Mock },
) {
  await service.sendOtp('u1', PHONE);
  const message = smsService.sendSms.mock.calls[0][1] as string;
  const otp = message.match(/code is (\d{6})/)![1];
  return { otp, message };
}

describe('PhoneVerificationService', () => {
  describe('sendOtp', () => {
    it('generates a 6-digit OTP and sends it via SmsService', async () => {
      const { prisma, smsService, redisService } = freshMocks();
      const service = makeService(prisma, smsService, redisService);

      const { otp, message } = await sendAndCaptureOtp(
        service,
        smsService as { sendSms: jest.Mock },
      );

      expect(otp).toMatch(/^\d{6}$/);
      expect(message).toContain(`code is ${otp}`);
      expect(smsService.sendSms).toHaveBeenCalledWith(PHONE, message);
    });

    it('does not store the OTP as plaintext', async () => {
      const { prisma, smsService, redisService } = freshMocks();
      const service = makeService(prisma, smsService, redisService);

      const { otp } = await sendAndCaptureOtp(
        service,
        smsService as { sendSms: jest.Mock },
      );

      const codeHash = prisma.phoneVerification.create.mock.calls[0][0].data
        .codeHash as string;
      expect(codeHash).not.toContain(otp);
      expect(codeHash).toContain(':');
    });

    it('rejects sending when the user is within the cooldown', async () => {
      const { prisma, smsService, redis, redisService } = freshMocks();
      redis.set.mockResolvedValue(null);
      const service = makeService(prisma, smsService, redisService);

      await expect(service.sendOtp('u1', PHONE)).rejects.toThrow(
        'Please wait before requesting another code',
      );
      expect(smsService.sendSms).not.toHaveBeenCalled();
    });

    it('rejects sending when the phone number is within the cooldown', async () => {
      const { prisma, smsService, redis, redisService } = freshMocks();
      redis.set
        .mockResolvedValueOnce('OK')
        .mockResolvedValueOnce(null);
      const service = makeService(prisma, smsService, redisService);

      await expect(service.sendOtp('u1', PHONE)).rejects.toThrow(
        'Please wait before requesting another code',
      );
      expect(smsService.sendSms).not.toHaveBeenCalled();
    });

    it('blocks phone-number rotation via the per-account daily budget', async () => {
      const { prisma, smsService, redis, redisService } = freshMocks();
      redis.eval
        .mockResolvedValueOnce(OTP_SEND_DAILY_LIMIT + 1)
        .mockResolvedValue(0);
      const service = makeService(prisma, smsService, redisService);

      await expect(service.sendOtp('u1', '+233244111111')).rejects.toThrow(
        'Daily code request limit reached',
      );
      expect(smsService.sendSms).not.toHaveBeenCalled();

      // The budget key is account-scoped, never phone-scoped.
      const budgetKey = redis.eval.mock.calls[0][2] as string;
      expect(budgetKey).toContain(':budget:u:u1');
      expect(budgetKey).not.toContain('244111111');

      // Both cooldown reservations are released after the budget is exhausted.
      expect(redis.eval).toHaveBeenCalledTimes(3);
      expect(redis.eval).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('DEL'),
        1,
        expect.any(String),
        expect.any(String),
      );
      expect(redis.eval).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining('DEL'),
        1,
        expect.any(String),
        expect.any(String),
      );
    });

    it('releases an acquired cooldown when a later Redis call fails', async () => {
      const { prisma, smsService, redis, redisService } = freshMocks();
      redis.set
        .mockResolvedValueOnce('OK')
        .mockRejectedValueOnce(new Error('redis down'));
      redis.eval.mockResolvedValue(0);
      const service = makeService(prisma, smsService, redisService);

      await expect(service.sendOtp('u1', PHONE)).rejects.toBeInstanceOf(
        ServiceUnavailableException,
      );
      expect(smsService.sendSms).not.toHaveBeenCalled();

      // The user cooldown that was acquired is released via compare-and-delete.
      expect(redis.eval).toHaveBeenCalledWith(
        expect.stringContaining('DEL'),
        1,
        expect.stringContaining(':cooldown:u:u1'),
        expect.any(String),
      );
    });

    it('reserves cooldowns atomically with SET NX and a 60s expiry', async () => {
      const { prisma, smsService, redis, redisService } = freshMocks();
      const service = makeService(prisma, smsService, redisService);

      await service.sendOtp('u1', PHONE);

      expect(redis.set).toHaveBeenCalledTimes(2);
      expect(redis.set).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining(':cooldown:u:u1'),
        expect.any(String),
        'EX',
        60,
        'NX',
      );
      expect(redis.set).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining(':cooldown:p:'),
        expect.any(String),
        'EX',
        60,
        'NX',
      );
    });

    it('fails closed when Redis is unavailable', async () => {
      const { prisma, smsService, redis, redisService } = freshMocks();
      redis.set.mockRejectedValue(new Error('redis down'));
      const service = makeService(prisma, smsService, redisService);

      await expect(service.sendOtp('u1', PHONE)).rejects.toBeInstanceOf(
        ServiceUnavailableException,
      );
      expect(smsService.sendSms).not.toHaveBeenCalled();
    });

    it('does not persist an OTP when the SMS send fails and releases cooldowns', async () => {
      const { prisma, smsService, redis, redisService } = freshMocks();
      redis.eval.mockResolvedValueOnce(1).mockResolvedValue(0);
      smsService.sendSms.mockRejectedValue(new Error('provider rejected'));
      const service = makeService(prisma, smsService, redisService);

      await expect(service.sendOtp('u1', PHONE)).rejects.toThrow(
        'provider rejected',
      );
      expect(prisma.phoneVerification.create).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
      // Both cooldown reservations are released via compare-and-delete, using
      // only this request's token (never another request's reservation).
      const token = redis.set.mock.calls[0][1];
      expect(redis.eval).toHaveBeenCalledWith(
        expect.stringContaining('DEL'),
        1,
        expect.any(String),
        token,
      );
    });

    it('invalidates the previous OTP before creating a new one', async () => {
      const { prisma, smsService, redisService } = freshMocks();
      const service = makeService(prisma, smsService, redisService);

      await service.sendOtp('u1', PHONE);

      expect(prisma.phoneVerification.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'u1', phoneNumber: PHONE },
      });
      expect(prisma.phoneVerification.create).toHaveBeenCalled();
    });

    it('propagates a database persistence failure after the SMS was sent', async () => {
      const { prisma, smsService, redisService } = freshMocks();
      prisma.$transaction.mockRejectedValue(new Error('db down'));
      const service = makeService(prisma, smsService, redisService);

      await expect(service.sendOtp('u1', PHONE)).rejects.toThrow('db down');
      expect(smsService.sendSms).toHaveBeenCalled();
    });

    it('does not expose the OTP or raw phone number in logs', async () => {
      const { prisma, smsService, redisService } = freshMocks();
      const service = makeService(prisma, smsService, redisService);
      const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();

      const { otp } = await sendAndCaptureOtp(
        service,
        smsService as { sendSms: jest.Mock },
      );

      const logged = logSpy.mock.calls.map((c) => String(c[0])).join(' ');
      expect(logged).not.toContain(PHONE);
      expect(logged).not.toContain(otp);
      expect(logged).toContain('+233******0000');
      logSpy.mockRestore();
    });
  });

  describe('verifyOtp', () => {
    function freshVerifyService(record: Record<string, unknown> | null) {
      const mocks = freshMocks();
      mocks.prisma.phoneVerification.findFirst.mockResolvedValue(record);
      const service = makeService(
        mocks.prisma,
        mocks.smsService,
        mocks.redisService,
      );
      return { ...mocks, service };
    }

    it('fails verification when the OTP is expired', async () => {
      const { prisma, service } = freshVerifyService({
        id: 'r1',
        userId: 'u1',
        phoneNumber: PHONE,
        codeHash: 'salt:hash',
        attempts: 0,
        expiresAt: new Date(Date.now() - 1000),
        verifiedAt: null,
      });

      await expect(service.verifyOtp('u1', '123456')).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(prisma.phoneVerification.deleteMany).toHaveBeenCalledWith({
        where: { id: 'r1' },
      });
    });

    it('increments attempts on a wrong OTP', async () => {
      const { prisma, service } = freshVerifyService({
        id: 'r1',
        userId: 'u1',
        phoneNumber: PHONE,
        codeHash: 'salt:deadbeef',
        attempts: 0,
        expiresAt: new Date(Date.now() + 60_000),
        verifiedAt: null,
      });

      await expect(service.verifyOtp('u1', '999999')).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(prisma.phoneVerification.update).toHaveBeenCalledWith({
        where: { id: 'r1' },
        data: { attempts: 1 },
      });
    });

    it('invalidates the OTP when the attempt limit is reached', async () => {
      const { prisma, service } = freshVerifyService({
        id: 'r1',
        userId: 'u1',
        phoneNumber: PHONE,
        codeHash: 'salt:deadbeef',
        attempts: OTP_MAX_ATTEMPTS - 1,
        expiresAt: new Date(Date.now() + 60_000),
        verifiedAt: null,
      });

      await expect(service.verifyOtp('u1', '999999')).rejects.toThrow(
        'Too many attempts',
      );
      expect(prisma.phoneVerification.deleteMany).toHaveBeenCalledWith({
        where: { id: 'r1' },
      });
    });

    it('verifies the correct OTP and marks the phone verified', async () => {
      const mocks = freshMocks();
      const service = makeService(
        mocks.prisma,
        mocks.smsService,
        mocks.redisService,
      );

      const { otp } = await sendAndCaptureOtp(
        service,
        mocks.smsService as { sendSms: jest.Mock },
      );
      const codeHash = mocks.prisma.phoneVerification.create.mock.calls[0][0]
        .data.codeHash as string;

      mocks.prisma.phoneVerification.findFirst.mockResolvedValue({
        id: 'r1',
        userId: 'u1',
        phoneNumber: PHONE,
        codeHash,
        attempts: 0,
        expiresAt: new Date(Date.now() + 60_000),
        verifiedAt: null,
      });

      const result = await service.verifyOtp('u1', otp);

      expect(result.success).toBe(true);
      expect(mocks.prisma.phoneVerification.update).toHaveBeenCalledWith({
        where: { id: 'r1' },
        data: { verifiedAt: expect.any(Date) },
      });
      expect(mocks.prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: {
          phoneNumber: PHONE,
          phoneVerifiedAt: expect.any(Date),
        },
      });
    });

    it('does not allow reuse after verification (no active OTP remains)', async () => {
      const { prisma, service } = freshVerifyService(null);

      await expect(service.verifyOtp('u1', '123456')).rejects.toThrow(
        'Invalid or expired verification code',
      );
      expect(prisma.phoneVerification.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'u1', verifiedAt: null } }),
      );
    });

    it('scopes the OTP lookup to the authenticated user', async () => {
      const { prisma, service } = freshVerifyService(null);

      await expect(service.verifyOtp('u2', '123456')).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(prisma.phoneVerification.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'u2', verifiedAt: null } }),
      );
    });
  });
});
