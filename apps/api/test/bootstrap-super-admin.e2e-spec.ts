import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { Client } from 'pg';
import { PrismaService } from '../src/prisma/prisma.service';
import { bootstrapSuperAdmin } from '../src/admin/bootstrap-super-admin';

const TEST_DB = 'devtodev_gate_bootstrap';

jest.setTimeout(180_000);

function localDbUrl(): string {
  const envPath = path.resolve(__dirname, '..', 'prisma', '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const m = content.match(/^\s*DATABASE_URL\s*=\s*"?([^"\n]+)"?\s*$/m);
    if (m) return m[1].trim();
  }
  const env = process.env.DATABASE_URL;
  if (!env) throw new Error('DATABASE_URL not found (no prisma/.env and DATABASE_URL env unset)');
  return env;
}

function withDb(url: string, db: string): string {
  const u = new URL(url);
  u.pathname = `/${db}`;
  return u.toString();
}

export function assertSafeTestDatabaseUrl(raw: string | undefined): void {
  if (!raw) {
    throw new Error('Refusing destructive test setup: test DATABASE_URL is missing');
  }
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error('Refusing destructive test setup: test DATABASE_URL is malformed');
  }
  if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
    throw new Error('Refusing destructive test setup: database host is not local');
  }
  if (url.pathname.replace(/^\//, '') !== TEST_DB) {
    throw new Error('Refusing destructive test setup: database is not the disposable test database');
  }
}

describe('SUPER_ADMIN bootstrap test-db URL guard', () => {
  it('accepts localhost', () => {
    expect(() =>
      assertSafeTestDatabaseUrl('postgresql://u:p@localhost:5432/devtodev_gate_bootstrap'),
    ).not.toThrow();
  });

  it('accepts 127.0.0.1', () => {
    expect(() =>
      assertSafeTestDatabaseUrl('postgresql://u:p@127.0.0.1:5432/devtodev_gate_bootstrap'),
    ).not.toThrow();
  });

  it('rejects a remote hostname', () => {
    expect(() =>
      assertSafeTestDatabaseUrl('postgresql://u:p@db.example.com:5432/devtodev_gate_bootstrap'),
    ).toThrow(/not local/);
  });

  it('rejects a wrong database name', () => {
    expect(() =>
      assertSafeTestDatabaseUrl('postgresql://u:p@localhost:5432/some_other_db'),
    ).toThrow(/disposable test database/);
  });

  it('rejects a malformed URL', () => {
    expect(() => assertSafeTestDatabaseUrl('not-a-url')).toThrow(/malformed/);
  });

  it('rejects a missing URL', () => {
    expect(() => assertSafeTestDatabaseUrl(undefined)).toThrow(/missing/);
  });
});

describe('SUPER_ADMIN bootstrap — PostgreSQL integration (disposable DB)', () => {
  let prisma: PrismaService;
  let seq = 0;

  beforeAll(async () => {
    const baseUrl = localDbUrl();
    const testUrl = withDb(baseUrl, TEST_DB);
    const maintenanceUrl = withDb(baseUrl, 'postgres');

    assertSafeTestDatabaseUrl(testUrl);

    const mgmt = new Client({ connectionString: maintenanceUrl });
    await mgmt.connect();
    await mgmt.query(`DROP DATABASE IF EXISTS ${TEST_DB} WITH (FORCE)`);
    await mgmt.query(`CREATE DATABASE ${TEST_DB}`);
    await mgmt.end();

    execSync('pnpm exec prisma migrate deploy --schema prisma/schema.prisma', {
      cwd: path.resolve(__dirname, '..'),
      env: { ...process.env, DATABASE_URL: testUrl },
      stdio: 'pipe',
    });

    process.env.DATABASE_URL = testUrl;
    prisma = new PrismaService();
    await prisma.$connect();
  });

  afterAll(async () => {
    if (prisma) await prisma.$disconnect();
    // Disposable database left in place; force-dropped at the start of the next run.
  });

  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  async function createUser(
    role: string = 'USER',
    status: string = 'ACTIVE',
    withIdentity = true,
  ) {
    return prisma.user.create({
      data: {
        email: `u${++seq}@test.local`,
        role: role as never,
        status: status as never,
        authIdentities: withIdentity
          ? { create: { provider: 'github', providerAccountId: `acct-${seq}` } }
          : undefined,
      },
    });
  }

  it('rejects a nonexistent user', async () => {
    const result = await bootstrapSuperAdmin(prisma, '00000000-0000-0000-0000-000000000000');
    expect(result).toEqual({ ok: false, reason: 'USER_NOT_FOUND' });
  });

  it('rejects a SUSPENDED user', async () => {
    const u = await createUser('USER', 'SUSPENDED');
    const result = await bootstrapSuperAdmin(prisma, u.id);
    expect(result).toEqual({ ok: false, reason: 'USER_NOT_ACTIVE_SUSPENDED' });
  });

  it('rejects a RESTRICTED user', async () => {
    const u = await createUser('USER', 'RESTRICTED');
    const result = await bootstrapSuperAdmin(prisma, u.id);
    expect(result).toEqual({ ok: false, reason: 'USER_NOT_ACTIVE_RESTRICTED' });
  });

  it('rejects a user with no OAuth identity', async () => {
    const u = await createUser('USER', 'ACTIVE', false);
    const result = await bootstrapSuperAdmin(prisma, u.id);
    expect(result).toEqual({ ok: false, reason: 'NO_AUTH_IDENTITY' });
  });

  it('rejects when a SUPER_ADMIN already exists', async () => {
    await createUser('SUPER_ADMIN', 'ACTIVE');
    const u = await createUser('USER', 'ACTIVE');
    const result = await bootstrapSuperAdmin(prisma, u.id);
    expect(result).toEqual({ ok: false, reason: 'SUPER_ADMIN_ALREADY_EXISTS' });
  });

  it('promotes an ACTIVE user with an identity and writes the audit event', async () => {
    const u = await createUser('USER', 'ACTIVE');
    const result = await bootstrapSuperAdmin(prisma, u.id);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.previousRole).toBe('USER');
      expect(result.newRole).toBe('SUPER_ADMIN');
    }

    const user = await prisma.user.findUnique({ where: { id: u.id } });
    expect(user!.role).toBe('SUPER_ADMIN');

    const audit = await prisma.adminAuditLog.findFirst({
      where: { action: 'SUPER_ADMIN_BOOTSTRAPPED', entityId: u.id },
    });
    expect(audit).not.toBeNull();
    expect(audit!.actorId).toBe(u.id);
    expect(audit!.metadata).toEqual({
      previousRole: 'USER',
      newRole: 'SUPER_ADMIN',
      reason: 'initial_platform_bootstrap',
    });
  });

  it('prevents concurrent bootstrap attempts from both succeeding', async () => {
    const u = await createUser('USER', 'ACTIVE');

    const results = await Promise.allSettled([
      bootstrapSuperAdmin(prisma, u.id),
      bootstrapSuperAdmin(prisma, u.id),
    ]);

    const ok = results.filter((r) => r.status === 'fulfilled' && (r as PromiseFulfilledResult<any>).value.ok);
    expect(ok.length).toBe(1);

    const superAdmins = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
    expect(superAdmins).toBe(1);

    const audits = await prisma.adminAuditLog.count({
      where: { action: 'SUPER_ADMIN_BOOTSTRAPPED', entityId: u.id },
    });
    expect(audits).toBe(1);
  });
});
