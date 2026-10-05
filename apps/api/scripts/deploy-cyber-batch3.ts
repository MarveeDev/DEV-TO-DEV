/**
 * DEV-TO-DEV Curriculum Deployment — Cybersecurity Batch 3 LessonBlock
 * delivery (final batch).
 *
 * Safely transfers the Cybersecurity Batch 3 lesson dataset (4 nodes, 78
 * blocks) into a target database. This is the production counterpart to the
 * development-only `author-cyber-batch3.ts`, and is intentionally separate
 * from `deploy-cyber-batch1.ts` (Batch 1), `deploy-cyber-batch2.ts`
 * (Batch 2), and `deploy-curriculum-lessons.ts` (CS/SE).
 *
 * Identity model: the authored lesson data is keyed by local-development
 * `sourceNodeId`. Production nodes are resolved by SEMANTIC identity
 * (roadmap slug "cybersecurity" + exact title) at deploy time, because UUIDs
 * are not portable across independently-seeded databases. `cyber-batch3-curriculum.ts`
 * owns this logic.
 *
 * Modes:
 *   --dry-run  Inspect only. Prints a report and writes NOTHING.
 *   --apply    Perform the validated deployment inside a transaction.
 *
 * Without either flag the script prints usage and exits without writing.
 *
 * Performance: the apply path performs a constant number of queries (resolve
 * nodes, fetch existing blocks once, create missing blocks, verify counts)
 * rather than querying per node, so it fits within the transaction timeout.
 *
 * Guardrails (fail closed): verifies the LessonBlock table exists, resolves and
 * verifies every target node by roadmap + title (and stage/order), requires
 * exactly one production match per node, detects duplicate positions and
 * duplicate semantic manifest entries, detects conflicting existing blocks, and
 * never modifies RoadmapNode / RoadmapProgress / prerequisites / users or any
 * node outside the four Cybersecurity Batch 3 targets.
 */
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { PrismaClient, Prisma, LessonBlockType } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  assembleCyberBatch3Lessons,
  validateCyberBatch3Lessons,
  findDuplicatePositions,
  findDuplicateCyberBatch3Entries,
  resolveCyberBatch3Nodes,
  computeCyberBatch3DeploymentPlan,
  summarizeCyberBatch3,
  CyberBatch3ExistingBlock,
  CYBER_BATCH3_NODES,
  CYBER_ROADMAP_SLUG,
  EXPECTED_CYBER_BATCH3_BLOCKS,
} from './cyber-batch3-curriculum';

const TRANSACTION_TIMEOUT_MS = 30_000;

function loadEnvFiles(paths: string[]): void {
  for (const filePath of paths) {
    if (!existsSync(filePath)) continue;
    const content = readFileSync(filePath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

loadEnvFiles([
  resolve(__dirname, '..', '.env'), // apps/api/.env
  resolve(__dirname, '..', '..', '.env'), // repo root .env
]);

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/devtodev?schema=public';
const prisma = new PrismaClient({
  adapter: new PrismaPg(new Pool({ connectionString })),
});

async function databaseIdentity(): Promise<string> {
  let db = 'unknown';
  let host = 'unknown';
  try {
    const url = new URL(connectionString);
    host = url.hostname;
    const path = url.pathname.replace(/^\//, '');
    if (path) db = path;
  } catch {
    // leave unknowns
  }
  return `database=${db} host=${host}`;
}

function usage(): string {
  return [
    'Usage:',
    '  pnpm --filter api exec ts-node scripts/deploy-cyber-batch3.ts --dry-run',
    '  pnpm --filter api exec ts-node scripts/deploy-cyber-batch3.ts --apply',
  ].join('\n');
}

interface ResolvedProductionNode {
  id: string;
  title: string;
  roadmapSlug: string;
  stage: string | null;
  order: number | null;
}

async function resolveProductionNodes(
  db: PrismaClient | Prisma.TransactionClient,
): Promise<{ mapping: Map<string, string>; errors: string[] }> {
  const nodes = await db.roadmapNode.findMany({
    where: { roadmap: { slug: CYBER_ROADMAP_SLUG } },
    select: {
      id: true,
      title: true,
      stage: true,
      order: true,
      roadmap: { select: { slug: true } },
    },
  });

  return resolveCyberBatch3Nodes(
    CYBER_BATCH3_NODES,
    nodes.map((n): ResolvedProductionNode => ({
      id: n.id,
      title: n.title,
      roadmapSlug: n.roadmap.slug,
      stage: n.stage,
      order: n.order,
    })),
  );
}

async function fetchExistingBlocks(
  db: PrismaClient | Prisma.TransactionClient,
  productionNodeIds: string[],
): Promise<CyberBatch3ExistingBlock[]> {
  return db.lessonBlock.findMany({
    where: { nodeId: { in: productionNodeIds } },
    select: { nodeId: true, type: true, order: true, content: true },
  });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const apply = args.includes('--apply');

  if (!dryRun && !apply) {
    console.error(usage());
    process.exitCode = 2;
    return;
  }

  console.log(
    `Cybersecurity Batch 3 Deployment ${dryRun ? '— DRY RUN' : '— APPLY'}`,
  );
  console.log(`Target: ${await databaseIdentity()}`);

  // 1. Assemble + validate (pure).
  const lessons = assembleCyberBatch3Lessons();
  const issues = validateCyberBatch3Lessons(lessons);
  if (issues.length > 0) {
    console.error(`Validation: FAIL (${issues.length} issue(s))`);
    for (const i of issues) {
      console.error(
        `  - ${i.nodeTitle} (${i.nodeId}) block[${i.index}] type=${i.type}: ${i.reason}`,
      );
    }
    process.exitCode = 1;
    return;
  }
  console.log(
    `Validation: PASS (${lessons.length} lessons, ${EXPECTED_CYBER_BATCH3_BLOCKS} blocks)`,
  );

  // 2. Duplicate position check.
  const dupes = findDuplicatePositions(lessons);
  if (dupes.length > 0) {
    console.error(`Duplicate check: FAIL (${dupes.length} duplicate(s))`);
    for (const d of dupes)
      console.error(`  - ${d.nodeId} position ${d.position}`);
    process.exitCode = 1;
    return;
  }
  console.log('Duplicate check: PASS');

  // 3. Manifest sanity.
  const semanticDupes = findDuplicateCyberBatch3Entries(CYBER_BATCH3_NODES);
  const cyberCount = CYBER_BATCH3_NODES.filter(
    (n) => n.roadmapSlug === CYBER_ROADMAP_SLUG,
  ).length;
  if (
    semanticDupes.length > 0 ||
    CYBER_BATCH3_NODES.length !== 4 ||
    cyberCount !== 4
  ) {
    console.error(
      `Manifest: FAIL (entries=${CYBER_BATCH3_NODES.length}, cyber=${cyberCount}, dupes=${semanticDupes.length})`,
    );
    process.exitCode = 1;
    return;
  }
  console.log(
    `Manifest: PASS (${CYBER_BATCH3_NODES.length} semantic targets, all cybersecurity)`,
  );

  // 4. Resolve production nodes by semantic identity.
  const { mapping, errors } = await resolveProductionNodes(prisma);
  if (errors.length > 0) {
    console.error(`Resolution: FAIL (${errors.length} error(s))`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Resolved production nodes: ${mapping.size}/${CYBER_BATCH3_NODES.length}`,
  );

  // 5. Scope check: report (never modify) LessonBlocks on other roadmaps.
  const otherBlocks = await prisma.lessonBlock.count({
    where: {
      node: {
        roadmap: { slug: { not: CYBER_ROADMAP_SLUG } },
      },
    },
  });
  console.log(
    `Scope check: ${otherBlocks} LessonBlock(s) exist on other roadmaps (ignored)`,
  );

  // 6. Fetch existing blocks (ONE query) and compute the plan in memory.
  const existingBlocks = await fetchExistingBlocks(prisma, [
    ...mapping.values(),
  ]);
  const plan = computeCyberBatch3DeploymentPlan(
    lessons,
    mapping,
    existingBlocks,
  );

  if (plan.conflicts.length > 0) {
    console.error(
      `Conflict check: FAIL (${plan.conflicts.length} conflict(s))`,
    );
    for (const c of plan.conflicts) {
      console.error(`  - ${c.title} (${c.nodeId}): ${c.reason}`);
    }
    console.error('Aborting: no writes performed.');
    process.exitCode = 1;
    return;
  }

  // 7. Per-node report.
  const summary = summarizeCyberBatch3(lessons, mapping, existingBlocks);
  console.log('');
  for (const row of summary) {
    console.log(row.title + ':');
    console.log(`  Existing: ${row.existing}`);
    console.log(`  Intended: ${row.intended}`);
    console.log(`  To insert: ${row.toInsert}`);
  }
  console.log('Total:');
  console.log(`  Existing: ${plan.existing}`);
  console.log(`  Intended: ${EXPECTED_CYBER_BATCH3_BLOCKS}`);
  console.log(`  To insert: ${plan.toInsert.length}`);
  console.log('');
  console.log('Validation: PASS');
  console.log('Manifest: PASS');
  console.log('Resolution: PASS');
  console.log('Conflict check: PASS');
  console.log('Scope check: PASS');

  if (dryRun) {
    console.log('Transaction: NOT STARTED');
    console.log('Writes: 0');
    return;
  }

  // 8. APPLY: re-resolve + re-fetch + re-plan inside a transaction, then insert.
  console.log('Transaction: STARTING');
  try {
    await prisma.$transaction(
      async (tx) => {
        const recheck = await resolveProductionNodes(tx);
        if (
          recheck.errors.length > 0 ||
          recheck.mapping.size !== CYBER_BATCH3_NODES.length
        ) {
          throw new Error(
            'Resolution changed since guardrail check; aborting.',
          );
        }

        const recheckExisting = await fetchExistingBlocks(tx, [
          ...recheck.mapping.values(),
        ]);
        const plan2 = computeCyberBatch3DeploymentPlan(
          lessons,
          recheck.mapping,
          recheckExisting,
        );
        if (plan2.conflicts.length > 0) {
          throw new Error(
            'Conflicting blocks appeared since guardrail check; aborting.',
          );
        }

        if (plan2.toInsert.length > 0) {
          const created = await tx.lessonBlock.createMany({
            data: plan2.toInsert.map((b) => ({
              nodeId: b.nodeId,
              type: b.type as LessonBlockType,
              content: b.content as Prisma.InputJsonValue,
              order: b.order,
            })),
          });
          console.log(`Inserted ${created.count} LessonBlock(s)`);
        } else {
          console.log('No blocks to insert (already fully deployed).');
        }

        const finalCount = await tx.lessonBlock.count({
          where: { nodeId: { in: [...recheck.mapping.values()] } },
        });
        if (finalCount !== EXPECTED_CYBER_BATCH3_BLOCKS) {
          throw new Error(
            `Verification failed: Cybersecurity Batch 3=${finalCount} (expected ${EXPECTED_CYBER_BATCH3_BLOCKS})`,
          );
        }
        console.log(
          `Verification: Cybersecurity Batch 3=${finalCount} (expected ${EXPECTED_CYBER_BATCH3_BLOCKS})`,
        );
      },
      { timeout: TRANSACTION_TIMEOUT_MS },
    );

    console.log('Transaction: COMMITTED');
    console.log('Deployment complete.');
  } catch (err) {
    console.error('Transaction: ROLLED BACK');
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  }
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
