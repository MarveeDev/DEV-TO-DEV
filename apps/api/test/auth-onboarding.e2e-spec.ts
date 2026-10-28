import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
const cookieParser = require('cookie-parser');
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { createHash, randomBytes } from 'crypto';
import { Client } from 'pg';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { SessionsService } from '../src/sessions/sessions.service';

const TEST_DB = 'devtodev_gate_onboard';

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

function assertSafeTestDb(raw: string): void {
  const u = new URL(raw);
  if (u.hostname !== 'localhost' && u.hostname !== '127.0.0.1') {
    throw new Error('Refusing destructive test setup: database host is not local');
  }
  if (u.pathname.replace(/^\//, '') !== TEST_DB) {
    throw new Error('Refusing destructive test setup: database is not the disposable test database');
  }
}

describe('Staff onboarding auth (disposable DB)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let sessions: SessionsService;

  let inviterId: string;

  function newToken(): { token: string; tokenHash: string } {
    const token = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    return { token, tokenHash };
  }

  beforeAll(async () => {
    const base = localDbUrl();
    const testUrl = withDb(base, TEST_DB);
    const maint = withDb(base, 'postgres');

    assertSafeTestDb(testUrl);

    const mgmt = new Client({ connectionString: maint });
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
    process.env.REDIS_URL = 'redis://localhost:6379';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get(PrismaService);
    sessions = app.get(SessionsService);

    inviterId = (await prisma.user.create({ data: { email: 'inviter@test.local', role: 'SUPER_ADMIN' } })).id;
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  async function cookieFor(userId: string): Promise<string> {
    const token = await sessions.createSession(userId);
    return `session_id=${token}`;
  }

  it('POST /auth/activate creates the account and never returns passwordHash', async () => {
    const { token } = newToken();
    await prisma.adminInvite.create({
      data: {
        email: 'staff1@test.local',
        name: 'Staff One',
        role: 'SUPPORT',
        tokenHash: createHash('sha256').update(token).digest('hex'),
        invitedById: inviterId,
        expiresAt: new Date(Date.now() + 60_000),
      },
    });

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/activate')
      .send({ token, password: 'password123' })
      .expect(200);

    expect(res.body.user).not.toHaveProperty('passwordHash');
    expect(res.body.user.email).toBe('staff1@test.local');
    expect(res.body.user.role).toBe('SUPPORT');

    // The account actually has a stored (hashed) password; only the API strips it.
    const stored = await prisma.user.findUnique({ where: { email: 'staff1@test.local' } });
    expect(stored?.passwordHash).toBeTruthy();
    expect(stored?.passwordHash).not.toContain('password123');
  });

  it('POST /auth/login never returns passwordHash', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'staff1@test.local', password: 'password123' })
      .expect(200);

    expect(res.body.user).not.toHaveProperty('passwordHash');
    expect(res.body.user.email).toBe('staff1@test.local');
  });

  it('GET /auth/me never returns passwordHash', async () => {
    const user = await prisma.user.findUnique({ where: { email: 'staff1@test.local' } });
    const cookie = await cookieFor(user!.id);

    const res = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Cookie', cookie)
      .expect(200);

    expect(res.body).not.toHaveProperty('passwordHash');
    expect(res.body.email).toBe('staff1@test.local');
  });

  it('rejects an expired activation token', async () => {
    const { token } = newToken();
    await prisma.adminInvite.create({
      data: {
        email: 'expired@test.local',
        role: 'MODERATOR',
        tokenHash: createHash('sha256').update(token).digest('hex'),
        invitedById: inviterId,
        expiresAt: new Date(Date.now() - 1000),
      },
    });

    await request(app.getHttpServer())
      .post('/api/v1/auth/activate')
      .send({ token, password: 'password123' })
      .expect(401);
  });

  it('rejects a reused activation token', async () => {
    const { token } = newToken();
    await prisma.adminInvite.create({
      data: {
        email: 'reuse@test.local',
        role: 'MODERATOR',
        tokenHash: createHash('sha256').update(token).digest('hex'),
        invitedById: inviterId,
        expiresAt: new Date(Date.now() + 60_000),
      },
    });

    await request(app.getHttpServer())
      .post('/api/v1/auth/activate')
      .send({ token, password: 'password123' })
      .expect(200);

    await request(app.getHttpServer())
      .post('/api/v1/auth/activate')
      .send({ token, password: 'password123' })
      .expect(401);
  });
});
