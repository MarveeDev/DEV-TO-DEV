/**
 * First-admin bootstrap script.
 *
 * Usage (run from the API container):
 *   docker compose exec -w /app/apps/api api pnpm exec ts-node src/admin/promote-admin.ts <email-or-username>
 *
 * This is a one-time, server-side operation. There is no public "make me admin"
 * endpoint. The script verifies the user exists and promotes them to ADMIN.
 */
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const identifier = process.argv[2]?.trim();
  if (!identifier) {
    console.error('Usage: ts-node src/admin/promote-admin.ts <email-or-username>');
    process.exit(1);
  }

  const connectionString =
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@postgres:5432/devtodev?schema=public';
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { developerProfile: { is: { username: identifier } } },
        ],
      },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      console.error(`No user found for "${identifier}"`);
      process.exit(1);
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' },
      select: { id: true, email: true, role: true },
    });

    console.log(`Promoted ${updated.email} (${updated.id}) to ${updated.role}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
