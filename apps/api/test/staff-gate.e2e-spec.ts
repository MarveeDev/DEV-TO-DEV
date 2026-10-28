import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { Client } from 'pg';
import { UserRole, UserStatus } from '@prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';
import { AdminService } from '../src/admin/admin.service';
import { AuthService } from '../src/auth/auth.service';
import { SessionsService } from '../src/sessions/sessions.service';
import { RedisService } from '../src/redis/redis.service';
import { ADMIN_ROLE_LOCK_KEY } from '../src/admin/permissions';

const TEST_DB = 'devtodev_gate1';

jest.setTimeout(180_000);

function localDbUrl(): string {
  const envPath = path.resolve(__dirname, '..', 'prisma', '.env');
  const content = fs.readFileSync(envPath, 'utf8');
  const m = content.match(/^\s*DATABASE_URL\s*=\s*"?([^"\n]+)"?\s*$/m);
  if (!m) throw new Error('DATABASE_URL not found in apps/api/prisma/.env');
  return m[1].trim();
}

function withDb(url: string, db: string): string {
  const u = new URL(url);
  u.pathname = `/${db}`;
  return u.toString();
}

describe('Admin Phase 1 — PostgreSQL integration (disposable DB)', () => {
  let prisma: PrismaService;
  let adminService: AdminService;
  let authService: AuthService;
  let testUrl: string;

  beforeAll(async () => {
    const baseUrl = localDbUrl();
    testUrl = withDb(baseUrl, TEST_DB);
    const maintenanceUrl = withDb(baseUrl, 'postgres');

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

    const sessions = {
      revokeAllForUser: async () => undefined,
    } as unknown as SessionsService;
    const redis = {
      getClient: () => ({ setex: async () => undefined, get: async () => null, del: async () => undefined }),
    } as unknown as RedisService;

    adminService = new AdminService(prisma, sessions);
    authService = new AuthService(prisma, redis);
  });

  afterAll(async () => {
    if (prisma) await prisma.$disconnect();
    // The disposable database is left in place and force-dropped at the start
    // of the next run (beforeAll), which avoids terminating the pool's idle
    // connections during teardown and the resulting unhandled FATAL errors.
  });

  async function createUser(email: string, role: UserRole = 'USER', status: UserStatus = 'ACTIVE') {
    return prisma.user.create({ data: { email, role, status } });
  }

  it('1. advisory-lock SQL executes through PrismaService inside a transaction', async () => {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${ADMIN_ROLE_LOCK_KEY}::int, 0)`;
    });
    expect(true).toBe(true);
  });

  it('2. concurrent super admin demotions leave at least one active super admin', async () => {
    const a = await createUser('sa-a@test.local', 'SUPER_ADMIN');
    const b = await createUser('sa-b@test.local', 'SUPER_ADMIN');

    const results = await Promise.allSettled([
      adminService.changeUserRole(a.id, b.id, 'MODERATOR'),
      adminService.changeUserRole(b.id, a.id, 'MODERATOR'),
    ]);

    const rejected = results.filter((r) => r.status === 'rejected');
    expect(rejected.length).toBeGreaterThanOrEqual(1);

    const remaining = await prisma.user.count({ where: { role: 'SUPER_ADMIN', status: 'ACTIVE' } });
    expect(remaining).toBeGreaterThanOrEqual(1);
    expect(remaining).toBeLessThanOrEqual(1);
  });

  it('3. concurrent accept vs revoke never grants from a revoked invite', async () => {
    const inviter = await createUser('inviter@test.local', 'SUPER_ADMIN');
    const invitee = await createUser('invitee@test.local', 'USER');

    const invite = await prisma.adminInvite.create({
      data: {
        email: 'invitee@test.local',
        role: 'MODERATOR',
        invitedById: inviter.id,
        expiresAt: new Date(Date.now() + 60_000),
      },
    });

    await Promise.allSettled([
      authService.applyPendingStaffInvite(invitee.id, 'invitee@test.local'),
      adminService.revokeInvite(inviter.id, invite.id),
    ]);

    const finalInvite = await prisma.adminInvite.findUnique({ where: { id: invite.id } });
    const finalUser = await prisma.user.findUnique({ where: { id: invitee.id } });

    expect(finalInvite).not.toBeNull();
    expect(finalUser).not.toBeNull();

    if (finalInvite!.status === 'REVOKED') {
      expect(finalUser!.role).toBe('USER');
    } else {
      expect(finalInvite!.status).toBe('ACCEPTED');
      expect(finalUser!.role).toBe('MODERATOR');
    }
  });

  it('4. expired invitation grants no role', async () => {
    const inviter = await createUser('inviter2@test.local', 'SUPER_ADMIN');
    const invitee = await createUser('invitee2@test.local', 'USER');

    await prisma.adminInvite.create({
      data: {
        email: 'invitee2@test.local',
        role: 'MODERATOR',
        invitedById: inviter.id,
        expiresAt: new Date(Date.now() - 60_000),
      },
    });

    await authService.applyPendingStaffInvite(invitee.id, 'invitee2@test.local');

    const finalUser = await prisma.user.findUnique({ where: { id: invitee.id } });
    expect(finalUser!.role).toBe('USER');
  });
});
