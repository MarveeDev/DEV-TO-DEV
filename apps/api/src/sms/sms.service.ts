import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  GONLINE_ERROR_CODES,
  GonlineClient,
  GonlineError,
  GonlineRawResponse,
  isGonlineErrorCode,
} from './gonline.client';
import { normalizePhone } from './phone.util';

export interface SendSmsResult {
  success: boolean;
  code?: string | number;
  messageId?: string;
  to?: string;
  units?: number;
  balance?: string;
}

export interface BalanceResult {
  success: boolean;
  code?: string | number;
  balance?: string;
}

/**
 * GOnline `code` is polymorphic: the string `"OK"` on success, or a numeric
 * error code on failure. Preserve the original type so callers can inspect it.
 */
function parseCode(raw: string | undefined): string | number | undefined {
  if (raw === undefined) {
    return undefined;
  }
  const numeric = Number(raw);
  return Number.isNaN(numeric) ? raw : numeric;
}

/** GOnline returns `units` as a number; parse it back from the raw text. */
function parseUnits(raw: string | undefined): number | undefined {
  if (raw === undefined || raw === '') {
    return undefined;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/**
 * Reusable SMS provider service. This is the single internal entry point for
 * all future SMS features (OTP, account verification, notifications, bulk).
 * No public HTTP endpoint is exposed in this phase.
 */
@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private readonly client: GonlineClient) {}

  async sendSms(to: string, message: string): Promise<SendSmsResult> {
    this.ensureConfigured();

    const normalized = normalizePhone(to);
    if (!normalized) {
      throw new BadRequestException('Invalid phone number');
    }

    if (!message || !message.trim()) {
      throw new BadRequestException('Message is required');
    }

    const response = await this.client.sendSms(normalized, message);
    this.logResponse('send-sms', response);

    const code = this.numericCode(response);
    if (code !== null && isGonlineErrorCode(code)) {
      throw this.buildError(code, response);
    }

    return {
      success: true,
      code: parseCode(this.rawCode(response)),
      messageId: response.fields.message_id ?? response.fields.messageId,
      to: response.fields.to ?? normalized,
      units: parseUnits(response.fields.units),
      balance: response.fields.balance,
    };
  }

  async checkBalance(): Promise<BalanceResult> {
    this.ensureConfigured();

    const response = await this.client.checkBalance();
    this.logResponse('check-balance', response);

    const code = this.numericCode(response);
    if (code !== null && isGonlineErrorCode(code)) {
      throw this.buildError(code, response);
    }

    return {
      success: true,
      code: parseCode(this.rawCode(response)),
      balance:
        response.fields.balance ??
        response.fields.amount ??
        response.fields.credit,
    };
  }

  private ensureConfigured(): void {
    if (!this.client.isConfigured()) {
      throw new ServiceUnavailableException('SMS provider is not configured');
    }
  }

  private rawCode(res: GonlineRawResponse): string | undefined {
    const raw = res.fields.code ?? res.fields.status;
    return raw === undefined || raw === '' ? undefined : raw;
  }

  private numericCode(res: GonlineRawResponse): number | null {
    const raw = this.rawCode(res);
    if (raw === undefined) {
      return null;
    }
    const parsed = Number.parseInt(raw, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  private buildError(code: number, res: GonlineRawResponse): GonlineError {
    const friendly =
      GONLINE_ERROR_CODES[code] ?? `SMS provider error (code ${code})`;
    const providerMessage =
      res.fields.message ?? res.fields.msg ?? res.fields.error;
    return new GonlineError(code, friendly, providerMessage);
  }

  private logResponse(action: string, res: GonlineRawResponse): void {
    const messageId = res.fields.message_id ?? res.fields.messageId;
    this.logger.log(
      `GOnline ${action} response: http=${res.httpStatus} code=${res.fields.code ?? 'n/a'}` +
        (messageId ? ` messageId=${messageId}` : ''),
    );
  }
}
