import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../sms/sms.service';
import {
  PhoneVerificationService,
  OTP_MAX_ATTEMPTS,
} from './phone-verification.service';

const PHONE = '+233244000000';

function makeService(
  prisma: Partial<PrismaService>,
  smsService: Partial<SmsService>,
): PhoneVerificationService {
  return new PhoneVerificationService(
    prisma as PrismaService,
    smsService as SmsService,
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

  phoneVerification.deleteMany.mockResolvedValue({ count: 0 });
  phoneVerification.create.mockResolvedValue({ id: 'r1' });
  phoneVerification.update.mockResolvedValue({ id: 'r1' });
  user.update.mockResolvedValue({ id: 'u1' });
  smsService.sendSms.mockResolvedValue({ success: true });

  return { prisma, phoneVerification, user, smsService };
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
  it('generates a 6-digit OTP and sends it via SmsService', async () => {
    const { prisma, smsService } = freshMocks();
    prisma.phoneVerification.findFirst.mockResolvedValue(null);
    const service = makeService(prisma, smsService);

    const { otp, message } = await sendAndCaptureOtp(
      service,
      smsService as { sendSms: jest.Mock },
    );

    expect(otp).toMatch(/^\d{6}$/);
    expect(message).toContain(`code is ${otp}`);
    expect(smsService.sendSms).toHaveBeenCalledWith(PHONE, message);
  });

  it('does not store the OTP as plaintext', async () => {
    const { prisma, smsService } = freshMocks();
    prisma.phoneVerification.findFirst.mockResolvedValue(null);
    const service = makeService(prisma, smsService);

    const { otp } = await sendAndCaptureOtp(
      service,
      smsService as { sendSms: jest.Mock },
    );

    const codeHash = prisma.phoneVerification.create.mock.calls[0][0].data
      .codeHash as string;
    expect(codeHash).not.toContain(otp);
    expect(codeHash).toContain(':');
  });

  it('rejects sending when within the resend cooldown', async () => {
    const { prisma, smsService } = freshMocks();
    prisma.phoneVerification.findFirst.mockResolvedValue({
      createdAt: new Date(),
    });
    const service = makeService(prisma, smsService);

    await expect(service.sendOtp('u1', PHONE)).rejects.toThrow(
      'Please wait before requesting another code',
    );
    expect(smsService.sendSms).not.toHaveBeenCalled();
  });

  it('invalidates the previous OTP before creating a new one', async () => {
    const { prisma, smsService } = freshMocks();
    prisma.phoneVerification.findFirst.mockResolvedValue(null);
    const service = makeService(prisma, smsService);

    await service.sendOtp('u1', PHONE);

    expect(prisma.phoneVerification.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'u1', phoneNumber: PHONE },
    });
    expect(prisma.phoneVerification.create).toHaveBeenCalled();
  });

  it('does not persist an OTP when the SMS send fails', async () => {
    const { prisma, smsService } = freshMocks();
    prisma.phoneVerification.findFirst.mockResolvedValue(null);
    smsService.sendSms.mockRejectedValue(new Error('provider rejected'));
    const service = makeService(prisma, smsService);

    await expect(service.sendOtp('u1', PHONE)).rejects.toThrow(
      'provider rejected',
    );
    expect(prisma.phoneVerification.create).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('fails verification when the OTP is expired', async () => {
    const { prisma, smsService } = freshMocks();
    prisma.phoneVerification.findFirst.mockResolvedValue({
      id: 'r1',
      userId: 'u1',
      phoneNumber: PHONE,
      codeHash: 'salt:hash',
      attempts: 0,
      expiresAt: new Date(Date.now() - 1000),
      verifiedAt: null,
    });
    const service = makeService(prisma, smsService);

    await expect(service.verifyOtp('u1', '123456')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(prisma.phoneVerification.deleteMany).toHaveBeenCalledWith({
      where: { id: 'r1' },
    });
  });

  it('increments attempts on a wrong OTP', async () => {
    const { prisma, smsService } = freshMocks();
    prisma.phoneVerification.findFirst.mockResolvedValue({
      id: 'r1',
      userId: 'u1',
      phoneNumber: PHONE,
      codeHash: 'salt:deadbeef',
      attempts: 0,
      expiresAt: new Date(Date.now() + 60_000),
      verifiedAt: null,
    });
    const service = makeService(prisma, smsService);

    await expect(service.verifyOtp('u1', '999999')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(prisma.phoneVerification.update).toHaveBeenCalledWith({
      where: { id: 'r1' },
      data: { attempts: 1 },
    });
  });

  it('invalidates the OTP when the attempt limit is reached', async () => {
    const { prisma, smsService } = freshMocks();
    prisma.phoneVerification.findFirst.mockResolvedValue({
      id: 'r1',
      userId: 'u1',
      phoneNumber: PHONE,
      codeHash: 'salt:deadbeef',
      attempts: OTP_MAX_ATTEMPTS - 1,
      expiresAt: new Date(Date.now() + 60_000),
      verifiedAt: null,
    });
    const service = makeService(prisma, smsService);

    await expect(service.verifyOtp('u1', '999999')).rejects.toThrow(
      'Too many attempts',
    );
    expect(prisma.phoneVerification.deleteMany).toHaveBeenCalledWith({
      where: { id: 'r1' },
    });
  });

  it('verifies the correct OTP and marks the phone verified', async () => {
    const { prisma, smsService } = freshMocks();
    prisma.phoneVerification.findFirst.mockResolvedValue(null);
    const service = makeService(prisma, smsService);

    const { otp } = await sendAndCaptureOtp(
      service,
      smsService as { sendSms: jest.Mock },
    );
    const codeHash = prisma.phoneVerification.create.mock.calls[0][0].data
      .codeHash as string;

    prisma.phoneVerification.findFirst.mockResolvedValue({
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
    expect(prisma.phoneVerification.update).toHaveBeenCalledWith({
      where: { id: 'r1' },
      data: { verifiedAt: expect.any(Date) },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'u1' },
      data: {
        phoneNumber: PHONE,
        phoneVerifiedAt: expect.any(Date),
      },
    });
  });

  it('does not allow reuse after verification (no active OTP remains)', async () => {
    const { prisma, smsService } = freshMocks();
    prisma.phoneVerification.findFirst.mockResolvedValue(null);
    const service = makeService(prisma, smsService);

    await expect(service.verifyOtp('u1', '123456')).rejects.toThrow(
      'Invalid or expired verification code',
    );
    expect(prisma.phoneVerification.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'u1', verifiedAt: null } }),
    );
  });

  it('scopes the OTP lookup to the authenticated user', async () => {
    const { prisma, smsService } = freshMocks();
    prisma.phoneVerification.findFirst.mockResolvedValue(null);
    const service = makeService(prisma, smsService);

    await expect(service.verifyOtp('u2', '123456')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(prisma.phoneVerification.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'u2', verifiedAt: null } }),
    );
  });
});
