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
  normalizeJson,
  CURRICULUM_NODES,
  EXPECTED_CS_BLOCKS,
  EXPECTED_SE_BLOCKS,
  EXPECTED_TOTAL_BLOCKS,
  CS_ROADMAP_SLUG,
  SE_ROADMAP_SLUG,
} from './curriculum';

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

interface ExistingBlock {
  id: string;
  type: string;
  order: number;
  content: unknown;
}

async function databaseIdentity(): Promise<string> {
  let db = 'unknown';
  let host = 'unknown';
  try {
    const url = new URL(connectionString);
    host = url.hostname;
    const path = url.pathname.replace(/^\//, '');
    if (path) db = path;
  } catch {
    // ignore; leave unknowns
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

type NodeConflict = { nodeId: string; title: string; reason: string };

function classifyNode(
  intended: { type: string; content: unknown }[],
  existing: ExistingBlock[],
): { conflict: string | null; missing: number } {
  const intendedByOrder = new Map(
    intended.map((b, i) => [
      i,
      { type: b.type, content: normalizeJson(b.content) },
    ]),
  );

  const existingByOrder = new Map<number, ExistingBlock[]>();
  for (const b of existing) {
    const list = existingByOrder.get(b.order) ?? [];
    list.push(b);
    existingByOrder.set(b.order, list);
  }

  for (const [order, blocks] of existingByOrder) {
    if (blocks.length > 1) {
      return {
        conflict: `duplicate existing blocks at position ${order}`,
        missing: 0,
      };
    }
    const block = blocks[0];
    const want = intendedByOrder.get(order);
    if (!want) {
      return {
        conflict: `unexpected existing block at position ${order} (type ${block.type})`,
        missing: 0,
      };
    }
    if (
      block.type !== want.type ||
      normalizeJson(block.content) !== want.content
    ) {
      return {
        conflict: `conflicting block at position ${order} (type ${block.type})`,
        missing: 0,
      };
    }
  }

  const missing = intended.length - existing.length;
  return { conflict: null, missing: Math.max(0, missing) };
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

  // 3. Manifest sanity: exactly 30 semantic targets, 15 CS + 15 SE, no dupes.
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
  const productionNodes = await prisma.roadmapNode.findMany({
    where: { roadmap: { slug: { in: [CS_ROADMAP_SLUG, SE_ROADMAP_SLUG] } } },
    select: {
      id: true,
      title: true,
      stage: true,
      order: true,
      roadmap: { select: { slug: true } },
    },
  });

  const { mapping, errors } = resolveSemanticNodes(
    CURRICULUM_NODES,
    productionNodes.map((n) => ({
      id: n.id,
      title: n.title,
      roadmapSlug: n.roadmap.slug,
      stage: n.stage,
      order: n.order,
    })),
  );

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

  // 6. Compare existing LessonBlocks for each resolved production node.
  let csExisting = 0;
  let seExisting = 0;
  let totalToInsert = 0;
  const conflicts: NodeConflict[] = [];

  for (const lesson of lessons) {
    const productionNodeId = mapping.get(lesson.nodeId);
    if (!productionNodeId) {
      conflicts.push({
        nodeId: lesson.nodeId,
        title: lesson.nodeTitle,
        reason: 'unresolved source node',
      });
      continue;
    }

    const existing = await prisma.lessonBlock.findMany({
      where: { nodeId: productionNodeId },
      orderBy: { order: 'asc' },
      select: { id: true, type: true, order: true, content: true },
    });

    const manifestEntry = CURRICULUM_NODES.find(
      (n) => n.sourceNodeId === lesson.nodeId,
    );
    if (manifestEntry?.roadmapSlug === CS_ROADMAP_SLUG)
      csExisting += existing.length;
    else if (manifestEntry?.roadmapSlug === SE_ROADMAP_SLUG)
      seExisting += existing.length;

    const result = classifyNode(lesson.blocks, existing);
    if (result.conflict) {
      conflicts.push({
        nodeId: lesson.nodeId,
        title: lesson.nodeTitle,
        reason: result.conflict,
      });
      continue;
    }
    if (result.missing > 0) totalToInsert += result.missing;
  }

  if (conflicts.length > 0) {
    console.error(`Conflict check: FAIL (${conflicts.length} conflict(s))`);
    for (const c of conflicts) {
      console.error(`  - ${c.title} (${c.nodeId}): ${c.reason}`);
    }
    console.error('Aborting: no writes performed.');
    process.exitCode = 1;
    return;
  }

  const combinedExisting = csExisting + seExisting;
  console.log('');
  console.log('CS:');
  console.log(`  Existing: ${csExisting}`);
  console.log(`  Intended: ${EXPECTED_CS_BLOCKS}`);
  console.log(`  To insert: ${EXPECTED_CS_BLOCKS - csExisting}`);
  console.log('SE:');
  console.log(`  Existing: ${seExisting}`);
  console.log(`  Intended: ${EXPECTED_SE_BLOCKS}`);
  console.log(`  To insert: ${EXPECTED_SE_BLOCKS - seExisting}`);
  console.log('Total:');
  console.log(`  Existing: ${combinedExisting}`);
  console.log(`  Intended: ${EXPECTED_TOTAL_BLOCKS}`);
  console.log(`  To insert: ${totalToInsert}`);
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

  // 7. APPLY: re-resolve + re-verify inside a transaction, insert missing blocks.
  console.log('Transaction: STARTING');
  try {
    await prisma.$transaction(async (tx) => {
      // Re-resolve production nodes inside the transaction.
      const recheckNodes = await tx.roadmapNode.findMany({
        where: {
          roadmap: { slug: { in: [CS_ROADMAP_SLUG, SE_ROADMAP_SLUG] } },
        },
        select: {
          id: true,
          title: true,
          stage: true,
          order: true,
          roadmap: { select: { slug: true } },
        },
      });
      const recheck = resolveSemanticNodes(
        CURRICULUM_NODES,
        recheckNodes.map((n) => ({
          id: n.id,
          title: n.title,
          roadmapSlug: n.roadmap.slug,
          stage: n.stage,
          order: n.order,
        })),
      );
      if (
        recheck.errors.length > 0 ||
        recheck.mapping.size !== CURRICULUM_NODES.length
      ) {
        throw new Error('Resolution changed since guardrail check; aborting.');
      }

      // Compute missing blocks using resolved production node IDs.
      const toCreate: Prisma.LessonBlockCreateManyInput[] = [];
      for (const lesson of lessons) {
        const productionNodeId = recheck.mapping.get(lesson.nodeId);
        if (!productionNodeId)
          throw new Error(`Unresolved node: ${lesson.nodeId}`);

        const existing = await tx.lessonBlock.findMany({
          where: { nodeId: productionNodeId },
          orderBy: { order: 'asc' },
          select: { order: true },
        });
        const existingOrders = new Set(existing.map((b) => b.order));
        lesson.blocks.forEach((block, index) => {
          if (!existingOrders.has(index)) {
            toCreate.push({
              nodeId: productionNodeId,
              type: block.type as LessonBlockType,
              content: block.content as Prisma.InputJsonValue,
              order: index,
            });
          }
        });
      }

      if (toCreate.length === 0) {
        console.log('No blocks to insert (already fully deployed).');
        return;
      }

      const created = await tx.lessonBlock.createMany({ data: toCreate });
      console.log(`Inserted ${created.count} LessonBlock(s)`);

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
    });

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
