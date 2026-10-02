import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../sms/sms.service';
import { normalizePhone } from '../sms/phone.util';
import { createHash, randomBytes, randomInt, timingSafeEqual } from 'crypto';

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 5;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;

export interface SendOtpResult {
  success: boolean;
  resendAfterSeconds: number;
}

export interface VerifyOtpResult {
  success: boolean;
  phoneNumber: string;
}

/**
 * Phone verification via one-time codes (OTP).
 *
 * The raw OTP only ever exists in memory while the SMS is being sent. Only a
 * salted SHA-256 hash of the OTP is persisted, so a database leak cannot
 * recover the code.
 */
@Injectable()
export class PhoneVerificationService {
  private readonly logger = new Logger(PhoneVerificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly smsService: SmsService,
  ) {}

  async sendOtp(userId: string, phoneNumber: string): Promise<SendOtpResult> {
    const normalized = normalizePhone(phoneNumber);
    if (!normalized) {
      throw new BadRequestException('Invalid phone number');
    }

    await this.assertResendAllowed(userId, normalized);

    const otp = this.generateOtp();
    const message = this.buildMessage(otp);

    // Send first and persist only on success so a rejected SMS never leaves a
    // misleading active OTP behind. The raw OTP is discarded on failure.
    await this.smsService.sendSms(normalized, message);

    const codeHash = this.hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.prisma.$transaction([
      this.prisma.phoneVerification.deleteMany({
        where: { userId, phoneNumber: normalized },
      }),
      this.prisma.phoneVerification.create({
        data: { userId, phoneNumber: normalized, codeHash, expiresAt },
      }),
    ]);

    this.logger.log(
      `OTP sent to ${this.maskPhone(normalized)} for user ${userId}`,
    );

    return { success: true, resendAfterSeconds: OTP_RESEND_COOLDOWN_SECONDS };
  }

  async verifyOtp(userId: string, otp: string): Promise<VerifyOtpResult> {
    if (!otp || !/^\d{6}$/.test(otp)) {
      throw new BadRequestException('Invalid verification code');
    }

    const record = await this.prisma.phoneVerification.findFirst({
      where: { userId, verifiedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    if (record.expiresAt <= new Date()) {
      await this.prisma.phoneVerification.deleteMany({
        where: { id: record.id },
      });
      throw new BadRequestException('Invalid or expired verification code');
    }

    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      await this.prisma.phoneVerification.deleteMany({
        where: { id: record.id },
      });
      throw new BadRequestException(
        'Too many attempts. Please request a new code.',
      );
    }

    if (!this.verifyOtpHash(otp, record.codeHash)) {
      const attempts = record.attempts + 1;
      if (attempts >= OTP_MAX_ATTEMPTS) {
        await this.prisma.phoneVerification.deleteMany({
          where: { id: record.id },
        });
        throw new BadRequestException(
          'Too many attempts. Please request a new code.',
        );
      }
      await this.prisma.phoneVerification.update({
        where: { id: record.id },
        data: { attempts },
      });
      throw new BadRequestException('Invalid or expired verification code');
    }

    await this.prisma.$transaction([
      this.prisma.phoneVerification.update({
        where: { id: record.id },
        data: { verifiedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: {
          phoneNumber: record.phoneNumber,
          phoneVerifiedAt: new Date(),
        },
      }),
    ]);

    this.logger.log(
      `Phone ${this.maskPhone(record.phoneNumber)} verified for user ${userId}`,
    );

    return { success: true, phoneNumber: record.phoneNumber };
  }

  private async assertResendAllowed(
    userId: string,
    phoneNumber: string,
  ): Promise<void> {
    const latest = await this.prisma.phoneVerification.findFirst({
      where: { userId, phoneNumber },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

    if (!latest) {
      return;
    }

    const elapsedMs = Date.now() - latest.createdAt.getTime();
    if (elapsedMs < OTP_RESEND_COOLDOWN_SECONDS * 1000) {
      throw new HttpException(
        'Please wait before requesting another code.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  /** Cryptographically secure 6-digit OTP (never Math.random). */
  private generateOtp(): string {
    return randomInt(0, 1_000_000).toString().padStart(OTP_LENGTH, '0');
  }

  private buildMessage(otp: string): string {
    return `Your DEV-TO-DEV verification code is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`;
  }

  /** Salts and hashes the OTP so the raw code is never stored. */
  private hashOtp(otp: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = createHash('sha256').update(`${salt}:${otp}`).digest('hex');
    return `${salt}:${hash}`;
  }

  private verifyOtpHash(otp: string, stored: string): boolean {
    const separator = stored.indexOf(':');
    if (separator === -1) {
      return false;
    }
    const salt = stored.slice(0, separator);
    const expectedHex = stored.slice(separator + 1);
    const actualHex = createHash('sha256')
      .update(`${salt}:${otp}`)
      .digest('hex');

    const expected = Buffer.from(expectedHex, 'hex');
    const actual = Buffer.from(actualHex, 'hex');
    return (
      expected.length === actual.length && timingSafeEqual(expected, actual)
    );
  }

  private maskPhone(phone: string): string {
    if (phone.length <= 5) {
      return '****';
    }
    return `${phone.slice(0, 4)}******${phone.slice(-4)}`;
  }
}
