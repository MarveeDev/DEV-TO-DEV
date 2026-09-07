import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

export type SignInProvider = 'github' | 'google';

export interface SignInNotificationInput {
  to: string | null | undefined;
  provider: SignInProvider;
  isNewUser: boolean;
  timestamp: Date;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend | null;
  private readonly from: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.from = process.env.MAIL_FROM || '';
    this.resend = apiKey ? new Resend(apiKey) : null;
  }

  async sendSignInNotification(input: SignInNotificationInput): Promise<void> {
    if (!this.resend) {
      this.logger.warn('RESEND_API_KEY is not configured; skipping sign-in notification email.');
      return;
    }

    if (!this.from) {
      this.logger.warn('MAIL_FROM is not configured; skipping sign-in notification email.');
      return;
    }

    if (!input.to) {
      return;
    }

    const providerName = input.provider === 'github' ? 'GitHub' : 'Google';
    const subject = input.isNewUser
      ? 'Welcome to DEV-TO-DEV'
      : 'New sign-in to your DEV-TO-DEV account';

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.from,
        to: [input.to],
        subject,
        html: this.buildHtml(input, providerName),
        text: this.buildText(input, providerName),
      });

      if (error) {
        this.logger.error(`Failed to send sign-in notification email: ${error.message}`);
        return;
      }

      this.logger.log(`Sign-in notification email sent (Resend id ${data?.id ?? 'n/a'})`);
    } catch (err) {
      this.logger.error(
        `Failed to send sign-in notification email: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  private buildText(input: SignInNotificationInput, providerName: string): string {
    const time = input.timestamp.toUTCString();

    if (input.isNewUser) {
      return `Welcome to DEV-TO-DEV! Your account has been created using ${providerName}. You are now signed in and can start connecting with other developers.`;
    }

    return `We detected a new sign-in to your DEV-TO-DEV account using ${providerName}.\n\nTime: ${time}\n\nIf this wasn't you, please secure your account and contact the DEV-TO-DEV team.`;
  }

  private buildHtml(input: SignInNotificationInput, providerName: string): string {
    const time = input.timestamp.toUTCString();
    const headline = input.isNewUser
      ? 'Welcome to DEV-TO-DEV'
      : 'New sign-in to your DEV-TO-DEV account';
    const body = input.isNewUser
      ? `Your DEV-TO-DEV account has been created using ${providerName}. You are now signed in and can start connecting with other developers.`
      : `We detected a new sign-in to your DEV-TO-DEV account using ${providerName}.`;

    return `
      <div style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:32px 32px 24px;">
                    <div style="font-size:20px;font-weight:800;color:#2563eb;letter-spacing:0.5px;">DEV-TO-DEV</div>
                    <h1 style="font-size:22px;font-weight:800;color:#0f172a;margin:24px 0 12px;line-height:1.3;">${headline}</h1>
                    <p style="font-size:15px;line-height:1.6;color:#334155;margin:0 0 16px;">${body}</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin:8px 0 24px;">
                      <tr>
                        <td style="padding:16px;">
                          <div style="font-size:13px;color:#64748b;line-height:1.9;">
                            <div><strong style="color:#0f172a;">Provider:</strong> ${providerName}</div>
                            <div><strong style="color:#0f172a;">Time:</strong> ${time}</div>
                          </div>
                        </td>
                      </tr>
                    </table>
                    <p style="font-size:13px;line-height:1.6;color:#64748b;margin:0;">
                      If this wasn't you, please secure your account and contact the DEV-TO-DEV team.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 32px;border-top:1px solid #e2e8f0;background-color:#f8fafc;">
                    <p style="font-size:12px;color:#94a3b8;margin:0;">You are receiving this email because you signed in to DEV-TO-DEV.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `;
  }
}
