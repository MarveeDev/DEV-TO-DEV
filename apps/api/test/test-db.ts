import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { Client } from 'pg';

function localDbUrl(): string {
  const envPath = path.resolve(__dirname, '..', 'prisma', '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const m = content.match(/^\s*DATABASE_URL\s*=\s*"?([^"\n]+)"?\s*$/m);
    if (m) return m[1].trim();
  }
  const env = process.env.DATABASE_URL;
  if (!env) {
    throw new Error('DATABASE_URL not found (no apps/api/prisma/.env and DATABASE_URL env unset)');
  }
  return env;
}

function withDb(url: string, db: string): string {
  const u = new URL(url);
  u.pathname = `/${db}`;
  return u.toString();
}

/**
 * Provisions a fresh, disposable PostgreSQL database, applies the current
 * migrations, and points the process environment (DATABASE_URL, REDIS_URL) at
 * it. Returns a teardown function that force-drops the database.
 *
 * Every suite must pass a unique `name` so parallel Jest workers never share a
 * database. The database host must be localhost/127.0.0.1 and the name must be
 * a `devtodev_gate*` disposable DB — a safety guard refuses anything else so
 * production data can never be touched by test cleanup.
 */
export async function provisionTestDb(name: string): Promise<() => Promise<void>> {
  const dbName = `devtodev_gate_${name}`;
  const base = localDbUrl();
  const testUrl = withDb(base, dbName);
  const maintUrl = withDb(base, 'postgres');

  const host = new URL(testUrl).hostname;
  if (host !== 'localhost' && host !== '127.0.0.1') {
    throw new Error('Refusing destructive test setup: database host is not local');
  }

  const mgmt = new Client({ connectionString: maintUrl });
  await mgmt.connect();
  await mgmt.query(`DROP DATABASE IF EXISTS "${dbName}" WITH (FORCE)`);
  await mgmt.query(`CREATE DATABASE "${dbName}"`);
  await mgmt.end();

  execSync('pnpm exec prisma migrate deploy --schema prisma/schema.prisma', {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, DATABASE_URL: testUrl },
    stdio: 'pipe',
  });

  process.env.DATABASE_URL = testUrl;
  if (!process.env.REDIS_URL) {
    process.env.REDIS_URL = 'redis://localhost:6379';
  }

  return async () => {
    // Intentionally leave the disposable database in place. It is force-dropped
    // at the start of the next run (DROP DATABASE ... WITH (FORCE) above), which
    // avoids terminating the Prisma pool's idle connections during teardown and
    // the resulting unhandled FATAL errors. Matches staff-gate/support e2e.
  };
}
