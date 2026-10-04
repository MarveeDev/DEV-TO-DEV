/**
 * DEV-TO-DEV Curriculum Deployment — production LessonBlock delivery.
 *
 * Safely transfers the authored LessonBlock dataset (Computer Science +
 * Software Engineering, 471 blocks) into a target database. This is the
 * production counterpart to the development-only `author-pilot-lessons.ts`.
 *
 * Identity model: the authored lesson data is keyed by local-development
 * `sourceNodeId`. Production nodes are resolved by SEMANTIC identity
 * (roadmap slug + exact title) at deploy time, because UUIDs are not portable
 * across independently-seeded databases. `curriculum.ts` owns this logic.
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
 * verifies every target node by roadmap + title (and stage/order), detects
 * duplicate positions and duplicate semantic manifest entries, detects
 * conflicting existing blocks, and never modifies RoadmapNode / RoadmapProgress
 * / prerequisites / users or any other roadmap.
 */
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { PrismaClient, Prisma, LessonBlockType } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  assembleCurriculumLessons,
  validateAssembledLessons,
  findDuplicatePositions,
  findDuplicateSemanticEntries,
  resolveSemanticNodes,
  computeDeploymentPlan,
  ExistingBlock,
  CURRICULUM_NODES,
  EXPECTED_CS_BLOCKS,
  EXPECTED_SE_BLOCKS,
  EXPECTED_TOTAL_BLOCKS,
  CS_ROADMAP_SLUG,
  SE_ROADMAP_SLUG,
} from './curriculum';

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
  resolve(__dirname, '..', '..', '.env'), // apps/.env (does not exist today)
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
    '  pnpm --filter api exec ts-node scripts/deploy-curriculum-lessons.ts --dry-run',
    '  pnpm --filter api exec ts-node scripts/deploy-curriculum-lessons.ts --apply',
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
    where: { roadmap: { slug: { in: [CS_ROADMAP_SLUG, SE_ROADMAP_SLUG] } } },
    select: {
      id: true,
      title: true,
      stage: true,
      order: true,
      roadmap: { select: { slug: true } },
    },
  });

  return resolveSemanticNodes(
    CURRICULUM_NODES,
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
): Promise<ExistingBlock[]> {
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

  console.log(`Curriculum Deployment ${dryRun ? '— DRY RUN' : '— APPLY'}`);
  console.log(`Target: ${await databaseIdentity()}`);

  // 1. Assemble + validate (pure).
  const lessons = assembleCurriculumLessons();
  const issues = validateAssembledLessons(lessons);
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
    `Validation: PASS (${lessons.length} lessons, ${EXPECTED_TOTAL_BLOCKS} blocks)`,
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
  const semanticDupes = findDuplicateSemanticEntries(CURRICULUM_NODES);
  const csManifest = CURRICULUM_NODES.filter(
    (n) => n.roadmapSlug === CS_ROADMAP_SLUG,
  ).length;
  const seManifest = CURRICULUM_NODES.filter(
    (n) => n.roadmapSlug === SE_ROADMAP_SLUG,
  ).length;
  if (
    semanticDupes.length > 0 ||
    CURRICULUM_NODES.length !== 30 ||
    csManifest !== 15 ||
    seManifest !== 15
  ) {
    console.error(
      `Manifest: FAIL (entries=${CURRICULUM_NODES.length}, CS=${csManifest}, SE=${seManifest}, dupes=${semanticDupes.length})`,
    );
    process.exitCode = 1;
    return;
  }
  console.log(
    `Manifest: PASS (${CURRICULUM_NODES.length} semantic targets: CS=${csManifest}, SE=${seManifest})`,
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
    `Resolved production nodes: ${mapping.size}/${CURRICULUM_NODES.length}`,
  );

  // 5. Scope check: report (never modify) LessonBlocks on other roadmaps.
  const otherBlocks = await prisma.lessonBlock.count({
    where: {
      node: {
        roadmap: { slug: { notIn: [CS_ROADMAP_SLUG, SE_ROADMAP_SLUG] } },
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
  const plan = computeDeploymentPlan(lessons, mapping, existingBlocks);

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

  const combinedExisting = plan.csExisting + plan.seExisting;
  console.log('');
  console.log('CS:');
  console.log(`  Existing: ${plan.csExisting}`);
  console.log(`  Intended: ${EXPECTED_CS_BLOCKS}`);
  console.log(`  To insert: ${EXPECTED_CS_BLOCKS - plan.csExisting}`);
  console.log('SE:');
  console.log(`  Existing: ${plan.seExisting}`);
  console.log(`  Intended: ${EXPECTED_SE_BLOCKS}`);
  console.log(`  To insert: ${EXPECTED_SE_BLOCKS - plan.seExisting}`);
  console.log('Total:');
  console.log(`  Existing: ${combinedExisting}`);
  console.log(`  Intended: ${EXPECTED_TOTAL_BLOCKS}`);
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

  // 7. APPLY: re-resolve + re-fetch + re-plan inside a transaction, then insert.
  console.log('Transaction: STARTING');
  try {
    await prisma.$transaction(
      async (tx) => {
        const recheck = await resolveProductionNodes(tx);
        if (
          recheck.errors.length > 0 ||
          recheck.mapping.size !== CURRICULUM_NODES.length
        ) {
          throw new Error(
            'Resolution changed since guardrail check; aborting.',
          );
        }

        const recheckExisting = await fetchExistingBlocks(tx, [
          ...recheck.mapping.values(),
        ]);
        const plan2 = computeDeploymentPlan(
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

        const csCount = await tx.lessonBlock.count({
          where: { node: { roadmap: { slug: CS_ROADMAP_SLUG } } },
        });
        const seCount = await tx.lessonBlock.count({
          where: { node: { roadmap: { slug: SE_ROADMAP_SLUG } } },
        });
        if (csCount !== EXPECTED_CS_BLOCKS || seCount !== EXPECTED_SE_BLOCKS) {
          throw new Error(
            `Verification failed: CS=${csCount} (expected ${EXPECTED_CS_BLOCKS}), SE=${seCount} (expected ${EXPECTED_SE_BLOCKS})`,
          );
        }
        console.log(
          `Verification: CS=${csCount}, SE=${seCount}, total=${csCount + seCount}`,
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
