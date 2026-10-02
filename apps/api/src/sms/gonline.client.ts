import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

/**
 * Raw, provider-shaped response from GOnline. Field names are normalized to
 * lowercase keys but never otherwise interpreted here — that is the job of
 * the SmsService.
 */
export interface GonlineRawResponse {
  raw: string;
  fields: Record<string, string>;
  httpStatus: number;
}

/**
 * Internal error for GOnline failures. `message` is always safe to surface to
 * a user (it never contains the API key). `providerMessage` is diagnostic-only
 * and must only ever be logged, never returned to the client.
 */
export class GonlineError extends Error {
  constructor(
    public readonly code: number | null,
    message: string,
    public readonly providerMessage?: string,
  ) {
    super(message);
    this.name = 'GonlineError';
  }
}

/** Documented GOnline error codes mapped to safe, human-readable messages. */
export const GONLINE_ERROR_CODES: Record<number, string> = {
  100: 'SMS provider returned an unknown error',
  101: 'Missing required parameter',
  102: 'Authentication failed',
  103: 'Invalid phone number',
  104: 'Invalid or empty message',
  105: 'Insufficient balance',
  106: 'Invalid sender ID',
  109: 'Account is not active',
  111: 'Message blocked for manual review (possible spam content)',
};

export function isGonlineErrorCode(code: number): boolean {
  return Object.prototype.hasOwnProperty.call(GONLINE_ERROR_CODES, code);
}

const REQUEST_TIMEOUT_MS = 15000;

@Injectable()
export class GonlineClient {
  private readonly logger = new Logger(GonlineClient.name);
  private readonly apiKey: string;
  private readonly senderId: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = process.env.GONLINE_API_KEY ?? '';
    this.senderId = process.env.GONLINE_SENDER_ID ?? '';
    this.baseUrl = process.env.GONLINE_SMS_URL ?? '';
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.senderId && this.baseUrl);
  }

  async sendSms(to: string, message: string): Promise<GonlineRawResponse> {
    return this.request({
      action: 'send-sms',
      api_key: this.apiKey,
      to,
      from: this.senderId,
      sms: message,
    });
  }

  async checkBalance(): Promise<GonlineRawResponse> {
    return this.request({
      action: 'check-balance',
      api_key: this.apiKey,
      response: 'json',
    });
  }

  private async request(
    params: Record<string, string>,
  ): Promise<GonlineRawResponse> {
    try {
      const res = await axios.get(this.baseUrl, {
        params,
        timeout: REQUEST_TIMEOUT_MS,
        validateStatus: () => true,
      });
      return parseBody(res.data, res.status);
    } catch (err) {
      // Network-level failure. Never log err.config/err.request — the request
      // carries the API key in its query parameters.
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `GOnline request failed (HTTP ${status ?? 'n/a'}): ${message}`,
      );
      throw new GonlineError(null, 'SMS provider is currently unreachable');
    }
  }
}

function parseBody(data: unknown, httpStatus: number): GonlineRawResponse {
  const raw = typeof data === 'string' ? data : JSON.stringify(data);

  let fields: Record<string, string> = {};
  if (typeof data === 'string') {
    fields = parseFields(data);
  } else if (data && typeof data === 'object') {
    fields = flatten(data as Record<string, unknown>);
  }

  return { raw, fields, httpStatus };
}

/** Accepts JSON or delimited `key=value` text responses from the provider. */
function parseFields(text: string): Record<string, string> {
  const trimmed = text.trim();

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (parsed && typeof parsed === 'object') {
        return flatten(parsed as Record<string, unknown>);
      }
    } catch {
      // Fall through to delimited parsing.
    }
  }

  const result: Record<string, string> = {};
  for (const part of trimmed.split(/[&|;\n]+/)) {
    if (!part) {
      continue;
    }
    const eq = part.indexOf('=');
    if (eq !== -1) {
      result[part.slice(0, eq).trim()] = part.slice(eq + 1).trim();
      continue;
    }
    const colon = part.indexOf(':');
    if (colon !== -1) {
      result[part.slice(0, colon).trim()] = part.slice(colon + 1).trim();
    }
  }
  return result;
}

function flatten(obj: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = stringifyField(value);
  }
  return result;
}

function stringifyField(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return String(value);
  }
  return JSON.stringify(value) ?? '';
}
