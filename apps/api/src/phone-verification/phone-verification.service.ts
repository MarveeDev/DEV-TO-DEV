import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../sms/sms.service';
import { RedisService } from '../redis/redis.service';
import { normalizePhone } from '../sms/phone.util';
import { createHash, randomBytes, randomInt, timingSafeEqual } from 'crypto';

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 5;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const OTP_SEND_DAILY_LIMIT = 10;
export const OTP_SEND_DAILY_WINDOW_SECONDS = 24 * 60 * 60;

const REDIS_KEY_PREFIX = 'devtodev:otp';

// Atomic INCR + first-use EXPIRE for the per-user send budget. The key's TTL
// is set only when the counter is first created, so the budget is a fixed
// 24-hour window anchored at the first request that creates the counter.
const BUDGET_SCRIPT = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then
  redis.call('EXPIRE', KEYS[1], tonumber(ARGV[1]))
end
return count
`;

// Compare-and-delete so a failure only releases the reservation this request
// created (never another request's reservation on the same key).
const RELEASE_COOLDOWN_SCRIPT = `
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
end
return 0
`;

function userCooldownKey(userId: string): string {
  return `${REDIS_KEY_PREFIX}:cooldown:u:${userId}`;
}

function phoneCooldownKey(phoneNumber: string): string {
  // Store a stable SHA-256 of the E.164 number rather than the raw number.
  const hash = createHash('sha256').update(phoneNumber).digest('hex');
  return `${REDIS_KEY_PREFIX}:cooldown:p:${hash}`;
}

function dailyBudgetKey(userId: string): string {
  return `${REDIS_KEY_PREFIX}:budget:u:${userId}`;
}

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
    private readonly redisService: RedisService,
  ) {}

  async sendOtp(userId: string, phoneNumber: string): Promise<SendOtpResult> {
    const normalized = normalizePhone(phoneNumber);
    if (!normalized) {
      throw new BadRequestException('Invalid phone number');
    }

    const userKey = userCooldownKey(userId);
    const phoneKey = phoneCooldownKey(normalized);
    const budgetKey = dailyBudgetKey(userId);
    const token = randomBytes(16).toString('hex');

    await this.reserveSend(userKey, phoneKey, budgetKey, token);

    const otp = this.generateOtp();
    const message = this.buildMessage(otp);

    // Send first and persist only on success so a rejected SMS never leaves a
    // misleading active OTP behind. The raw OTP is discarded on failure.
    try {
      await this.smsService.sendSms(normalized, message);
    } catch (err) {
      // Release the cooldown reservations so the caller can retry immediately;
      // the daily budget slot stays consumed (attempts are counted, never
      // refunded) so concurrent requests cannot exceed the account budget.
      await this.releaseCooldown(userKey, token).catch(() => undefined);
      await this.releaseCooldown(phoneKey, token).catch(() => undefined);
      throw err;
    }

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

  /**
   * Atomically reserves the send budget and cooldowns before any SMS is sent.
   *
   * Cooldowns use `SET NX` and the per-user 24h budget uses an INCR+EXPIRE Lua
   * script, so reservations are shared and atomic across API instances. A
   * reservation is acquired before the SMS is sent, and a Redis failure fails
   * closed (503) rather than allowing an unlimited send.
   */
  private async reserveSend(
    userKey: string,
    phoneKey: string,
    budgetKey: string,
    token: string,
  ): Promise<void> {
    let userReserved = false;
    let phoneReserved = false;
    try {
      userReserved = await this.reserveCooldown(userKey, token);
      if (!userReserved) {
        throw new HttpException(
          'Please wait before requesting another code.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      phoneReserved = await this.reserveCooldown(phoneKey, token);
      if (!phoneReserved) {
        throw new HttpException(
          'Please wait before requesting another code.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      const count = await this.consumeBudget(budgetKey);
      if (count > OTP_SEND_DAILY_LIMIT) {
        throw new HttpException(
          'Daily code request limit reached.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    } catch (err) {
      if (userReserved) {
        await this.releaseCooldown(userKey, token).catch(() => undefined);
      }
      if (phoneReserved) {
        await this.releaseCooldown(phoneKey, token).catch(() => undefined);
      }

      if (err instanceof HttpException) {
        throw err;
      }
      this.logger.error(
        `OTP send limiter unavailable: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      throw new ServiceUnavailableException(
        'Phone verification is temporarily unavailable. Please try again later.',
      );
    }
  }

  private get redis() {
    return this.redisService.getClient();
  }

  private async reserveCooldown(key: string, token: string): Promise<boolean> {
    const result = await this.redis.set(
      key,
      token,
      'EX',
      OTP_RESEND_COOLDOWN_SECONDS,
      'NX',
    );
    return result === 'OK';
  }

  private async releaseCooldown(key: string, token: string): Promise<void> {
    await this.redis.eval(RELEASE_COOLDOWN_SCRIPT, 1, key, token);
  }

  private async consumeBudget(key: string): Promise<number> {
    const count = await this.redis.eval(
      BUDGET_SCRIPT,
      1,
      key,
      String(OTP_SEND_DAILY_WINDOW_SECONDS),
    );
    return Number(count);
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
