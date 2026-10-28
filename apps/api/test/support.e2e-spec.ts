import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
const cookieParser = require('cookie-parser');
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { Client } from 'pg';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { SessionsService } from '../src/sessions/sessions.service';

const TEST_DB = 'devtodev_gate_support';

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

describe('Support HTTP integration (disposable DB)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let sessions: SessionsService;

  let devA: string;
  let devB: string;
  let agent: string;
  let moderator: string;

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

    devA = (await prisma.user.create({ data: { email: 'dev-a@test.local', role: 'USER' } })).id;
    devB = (await prisma.user.create({ data: { email: 'dev-b@test.local', role: 'USER' } })).id;
    agent = (await prisma.user.create({ data: { email: 'agent@test.local', role: 'SUPPORT' } })).id;
    moderator = (await prisma.user.create({ data: { email: 'mod@test.local', role: 'MODERATOR' } })).id;
  });

  afterAll(async () => {
    if (app) await app.close();
    // Disposable DB left in place; force-dropped on the next run.
  });

  async function cookieFor(userId: string): Promise<string> {
    const token = await sessions.createSession(userId);
    return `session_id=${token}`;
  }

  async function createTicketAs(userId: string, subject: string) {
    const cookie = await cookieFor(userId);
    const res = await request(app.getHttpServer())
      .post('/api/v1/support/tickets')
      .set('Cookie', cookie)
      .send({ subject, description: 'description' });
    return res.body;
  }

  it('rejects unauthenticated developer requests', async () => {
    await request(app.getHttpServer()).get('/api/v1/support/tickets').expect(401);
    await request(app.getHttpServer()).post('/api/v1/support/tickets').send({ subject: 's', description: 'd' }).expect(401);
  });

  it('rejects unauthenticated staff requests', async () => {
    await request(app.getHttpServer()).get('/api/v1/admin/support/tickets').expect(401);
  });

  it('a developer sees only their own tickets', async () => {
    const ticketA = await createTicketAs(devA, 'A ticket');
    await createTicketAs(devB, 'B ticket');

    const cookieA = await cookieFor(devA);
    const list = await request(app.getHttpServer()).get('/api/v1/support/tickets').set('Cookie', cookieA).expect(200);
    expect(list.body.data.length).toBe(1);
    expect(list.body.data[0].id).toBe(ticketA.id);
  });

  it('a developer cannot read another developer ticket (non-disclosing)', async () => {
    const ticketB = await createTicketAs(devB, 'Private B ticket');
    const cookieA = await cookieFor(devA);

    await request(app.getHttpServer()).get(`/api/v1/support/tickets/${ticketB.id}`).set('Cookie', cookieA).expect(404);
  });

  it('developers never see internal notes', async () => {
    const ticket = await createTicketAs(devA, 'Note isolation');
    const agentCookie = await cookieFor(agent);

    await request(app.getHttpServer())
      .post(`/api/v1/admin/support/tickets/${ticket.id}/messages`)
      .set('Cookie', agentCookie)
      .send({ body: 'internal secret note', kind: 'NOTE' })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/api/v1/admin/support/tickets/${ticket.id}/messages`)
      .set('Cookie', agentCookie)
      .send({ body: 'public reply' })
      .expect(201);

    const devCookie = await cookieFor(devA);
    const detail = await request(app.getHttpServer()).get(`/api/v1/support/tickets/${ticket.id}`).set('Cookie', devCookie).expect(200);

    expect(detail.body.messages.length).toBe(1);
    expect(detail.body.messages[0].body).toBe('public reply');
    expect(JSON.stringify(detail.body)).not.toContain('internal secret note');
  });

  it('SUPPORT staff can access and read notes', async () => {
    const ticket = await createTicketAs(devA, 'Staff view');
    const agentCookie = await cookieFor(agent);
    await request(app.getHttpServer())
      .post(`/api/v1/admin/support/tickets/${ticket.id}/messages`)
      .set('Cookie', agentCookie)
      .send({ body: 'note for staff', kind: 'NOTE' })
      .expect(201);

    const detail = await request(app.getHttpServer()).get(`/api/v1/admin/support/tickets/${ticket.id}`).set('Cookie', agentCookie).expect(200);
    expect(detail.body.messages.some((m: any) => m.kind === 'NOTE' && m.body === 'note for staff')).toBe(true);
  });

  it('a role without support.manage cannot use staff endpoints', async () => {
    const modCookie = await cookieFor(moderator);
    await request(app.getHttpServer()).get('/api/v1/admin/support/tickets').set('Cookie', modCookie).expect(403);
  });

  it('a developer cannot use staff endpoints', async () => {
    const devCookie = await cookieFor(devA);
    await request(app.getHttpServer()).get('/api/v1/admin/support/tickets').set('Cookie', devCookie).expect(403);
  });

  it('SUPPORT staff cannot access unrelated Admin endpoints', async () => {
    const agentCookie = await cookieFor(agent);
    await request(app.getHttpServer()).get('/api/v1/admin/users').set('Cookie', agentCookie).expect(403);
    await request(app.getHttpServer()).get('/api/v1/admin/staff').set('Cookie', agentCookie).expect(403);
  });

  it('staff assignee validation rejects non-staff and inactive assignees', async () => {
    const ticket = await createTicketAs(devA, 'Assign isolation');
    const agentCookie = await cookieFor(agent);
    const suspendedAgent = (await prisma.user.create({ data: { email: 'suspended-agent@test.local', role: 'SUPPORT', status: 'SUSPENDED' } })).id;

    await request(app.getHttpServer())
      .patch(`/api/v1/admin/support/tickets/${ticket.id}`)
      .set('Cookie', agentCookie)
      .send({ assigneeId: devB })
      .expect(400);

    await request(app.getHttpServer())
      .patch(`/api/v1/admin/support/tickets/${ticket.id}`)
      .set('Cookie', agentCookie)
      .send({ assigneeId: suspendedAgent })
      .expect(400);
  });

  it('staff status changes set and clear closedAt', async () => {
    const ticket = await createTicketAs(devA, 'Lifecycle');
    const agentCookie = await cookieFor(agent);

    await request(app.getHttpServer())
      .patch(`/api/v1/admin/support/tickets/${ticket.id}`)
      .set('Cookie', agentCookie)
      .send({ status: 'RESOLVED' })
      .expect(200);

    let detail = await request(app.getHttpServer()).get(`/api/v1/admin/support/tickets/${ticket.id}`).set('Cookie', agentCookie).expect(200);
    expect(detail.body.closedAt).not.toBeNull();

    await request(app.getHttpServer())
      .patch(`/api/v1/admin/support/tickets/${ticket.id}`)
      .set('Cookie', agentCookie)
      .send({ status: 'OPEN' })
      .expect(200);

    detail = await request(app.getHttpServer()).get(`/api/v1/admin/support/tickets/${ticket.id}`).set('Cookie', agentCookie).expect(200);
    expect(detail.body.closedAt).toBeNull();
  });
});
