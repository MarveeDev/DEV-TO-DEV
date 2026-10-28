import { PrismaClient, Prisma } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { ADMIN_ROLE_LOCK_KEY } from './permissions';

export type BootstrapOutcome =
  | { ok: true; userId: string; previousRole: string; newRole: 'SUPER_ADMIN'; auditId: string }
  | { ok: false; reason: string };

const CONFIRM_TOKEN = 'CONFIRM';

/**
 * Fail-closed connection check. No default/fallback DATABASE_URL exists; the
 * operator must supply the intended target database explicitly. The value is
 * never logged.
 */
export function requireDatabaseUrl(env: NodeJS.ProcessEnv): string | undefined {
  if (!env.DATABASE_URL) {
    return 'DATABASE_URL is not set (refusing to guess a target database)';
  }
  return undefined;
}

/**
 * Pure argument validation. Requires an explicit target account ID, an
 * explicit environment acknowledgement, and an explicit confirmation token.
 * Returns a safe error string or the parsed inputs.
 */
export function resolveBootstrapArgs(
  env: NodeJS.ProcessEnv,
): string | { userId: string; environment: string } {
  const userId = env.SUPER_ADMIN_BOOTSTRAP_USER_ID?.trim();
  const environment = env.SUPER_ADMIN_BOOTSTRAP_ENV?.trim();
  const confirm = env.SUPER_ADMIN_BOOTSTRAP_CONFIRM?.trim();

  if (!userId) {
    return 'SUPER_ADMIN_BOOTSTRAP_USER_ID is required (explicit target account ID)';
  }
  if (!environment) {
    return 'SUPER_ADMIN_BOOTSTRAP_ENV is required (explicit target environment name)';
  }
  if (confirm !== CONFIRM_TOKEN) {
    return `SUPER_ADMIN_BOOTSTRAP_CONFIRM must equal "${CONFIRM_TOKEN}"`;
  }

  return { userId, environment };
}

/**
 * Establishes the first SUPER_ADMIN. Runs entirely inside one transaction and
 * takes the shared role advisory lock so concurrent bootstrap attempts (and
 * role changes) serialize.
 *
 * Audit note: AdminAuditLog.actorId is a required FK to User and the schema
 * has no "system" actor, so the target account is recorded as its own actor.
 * This does NOT imply a pre-existing Super Admin authorized the action; the
 * event is distinguished by metadata.reason = "initial_platform_bootstrap".
 */
export async function bootstrapSuperAdmin(
  prisma: PrismaClient,
  userId: string,
): Promise<BootstrapOutcome> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${ADMIN_ROLE_LOCK_KEY}::int, 0)`;

    const target = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, status: true, _count: { select: { authIdentities: true } } },
    });
    if (!target) return { ok: false, reason: 'USER_NOT_FOUND' };
    if (target.status !== 'ACTIVE') return { ok: false, reason: `USER_NOT_ACTIVE_${target.status}` };
    if (target._count.authIdentities < 1) return { ok: false, reason: 'NO_AUTH_IDENTITY' };
    if (target.role === 'SUPER_ADMIN') return { ok: false, reason: 'ALREADY_SUPER_ADMIN' };

    const existing = await tx.user.count({ where: { role: 'SUPER_ADMIN' } });
    if (existing >= 1) return { ok: false, reason: 'SUPER_ADMIN_ALREADY_EXISTS' };

    const updated = await tx.user.update({
      where: { id: userId },
      data: { role: 'SUPER_ADMIN' },
      select: { id: true, role: true },
    });

    const audit = await tx.adminAuditLog.create({
      data: {
        actorId: userId,
        action: 'SUPER_ADMIN_BOOTSTRAPPED',
        entityType: 'User',
        entityId: userId,
        metadata: {
          previousRole: target.role,
          newRole: 'SUPER_ADMIN',
          reason: 'initial_platform_bootstrap',
        } as Prisma.InputJsonValue,
      },
      select: { id: true },
    });

    return {
      ok: true,
      userId: updated.id,
      previousRole: target.role,
      newRole: 'SUPER_ADMIN',
      auditId: audit.id,
    };
  });
}

async function main() {
  const dbError = requireDatabaseUrl(process.env);
  if (dbError) {
    console.error(`Bootstrap aborted: ${dbError}`);
    process.exit(1);
  }

  const resolved = resolveBootstrapArgs(process.env);
  if (typeof resolved === 'string') {
    console.error(`Bootstrap aborted: ${resolved}`);
    process.exit(1);
  }

  console.log(`Target environment acknowledged: ${resolved.environment}`);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const result = await bootstrapSuperAdmin(prisma, resolved.userId);
    if (!result.ok) {
      console.error(`Bootstrap aborted: ${result.reason}`);
      process.exitCode = 1;
      return;
    }
    console.log(
      `Bootstrap complete: ${result.userId} ${result.previousRole} -> ${result.newRole} (audit ${result.auditId})`,
    );
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
