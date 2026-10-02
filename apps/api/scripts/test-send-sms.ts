/**
 * Dev-only manual test for the GOnline SMS integration.
 *
 * This script is NOT part of the application and is never executed during
 * build, startup, migration, or tests. It only sends when you run it by hand.
 *
 * Usage (from the apps/api directory):
 *   pnpm exec ts-node scripts/test-send-sms.ts +233244000000 "Your test message"
 *   pnpm exec ts-node scripts/test-send-sms.ts --balance
 *
 * The script reads GONLINE_API_KEY / GONLINE_SENDER_ID / GONLINE_SMS_URL from
 * the environment (loading the repo .env files if they are present). It never
 * prints the API key.
 */
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { GonlineClient, GonlineError } from '../src/sms/gonline.client';
import { SmsService } from '../src/sms/sms.service';

function loadEnvFiles(paths: string[]): void {
  for (const filePath of paths) {
    if (!existsSync(filePath)) {
      continue;
    }
    const content = readFileSync(filePath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }
      const eq = trimmed.indexOf('=');
      if (eq === -1) {
        continue;
      }
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  }
}

// Resolve .env files relative to this script: apps/api/scripts -> repo root.
loadEnvFiles([
  resolve(__dirname, '..', '..', '.env'), // apps/api/.env
  resolve(__dirname, '..', '..', '..', '.env'), // repo root .env
]);

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  const client = new GonlineClient();
  const sms = new SmsService(client);

  if (!client.isConfigured()) {
    console.error(
      'SMS provider is not configured. Set GONLINE_API_KEY, GONLINE_SENDER_ID, and GONLINE_SMS_URL.',
    );
    process.exit(1);
  }

  if (args[0] === '--balance') {
    const result = await sms.checkBalance();
    console.log('Balance check succeeded:', result);
    return;
  }

  const to = args[0];
  const message = args.slice(1).join(' ');

  if (!to || !message) {
    console.error(
      'Usage: pnpm exec ts-node scripts/test-send-sms.ts <phone> <message>',
    );
    console.error(
      '   or: pnpm exec ts-node scripts/test-send-sms.ts --balance',
    );
    process.exit(1);
  }

  const result = await sms.sendSms(to, message);
  console.log('SMS send succeeded:', result);
}

main().catch((err: unknown) => {
  if (err instanceof GonlineError) {
    // `message` is safe to print; never log providerMessage here.
    console.error(`GOnline error (code ${err.code ?? 'n/a'}): ${err.message}`);
  } else {
    console.error(err instanceof Error ? err.message : String(err));
  }
  process.exit(1);
});
