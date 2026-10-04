/**
 * DEV-TO-DEV Curriculum Authoring — LessonBlock writer (development only).
 *
 * This is an isolated, versioned development script (NOT part of the running
 * application and never executed during build/startup/tests). It writes the
 * assembled curriculum (see `curriculum.ts`) into the `LessonBlock` table for
 * the Computer Science and Software Engineering nodes.
 *
 * For production data delivery, use `deploy-curriculum-lessons.ts` instead.
 *
 * Guarantees:
 *   - Reads only: RoadmapNode lookups are used solely to confirm the target
 *     node exists. No Roadmap, RoadmapNode, RoadmapProgress, prerequisite, or
 *     book/video field is ever modified.
 *   - Validates every block against the LessonBlock content contract before
 *     writing. If anything is malformed, the script aborts without writing.
 *   - Idempotent: for each node it deletes any existing LessonBlocks for that
 *     node and recreates them, so re-running never duplicates or leaves stale
 *     blocks.
 *
 * Usage (from apps/api):
 *   pnpm exec ts-node scripts/author-pilot-lessons.ts
 */
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { PrismaClient, LessonBlockType } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  assembleCurriculumLessons,
  validateAssembledLessons,
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
  resolve(__dirname, '..', '..', '.env'), // repo root .env
]);

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/devtodev?schema=public';
const prisma = new PrismaClient({
  adapter: new PrismaPg(new Pool({ connectionString })),
});

async function main(): Promise<void> {
  const allLessons = assembleCurriculumLessons();

  const issues = validateAssembledLessons(allLessons);
  if (issues.length > 0) {
    console.error(
      `Aborting: ${issues.length} malformed block(s) found. Nothing was written.`,
    );
    for (const issue of issues) {
      console.error(
        `  - ${issue.nodeTitle} (${issue.nodeId}) block[${issue.index}] type=${issue.type}: ${issue.reason}`,
      );
    }
    process.exitCode = 1;
    return;
  }

  const summary: { nodeId: string; nodeTitle: string; count: number }[] = [];

  for (const lesson of allLessons) {
    const node = await prisma.roadmapNode.findUnique({
      where: { id: lesson.nodeId },
      select: { id: true, title: true },
    });

    if (!node) {
      throw new Error(
        `Curriculum node not found: ${lesson.nodeTitle} (${lesson.nodeId})`,
      );
    }

    // Idempotent reset for this node, then recreate in order.
    await prisma.lessonBlock.deleteMany({ where: { nodeId: lesson.nodeId } });

    const created = await prisma.$transaction(
      lesson.blocks.map((block, index) =>
        prisma.lessonBlock.create({
          data: {
            nodeId: lesson.nodeId,
            type: block.type as LessonBlockType,
            content: block.content as object,
            order: index,
          },
        }),
      ),
    );

    summary.push({
      nodeId: node.id,
      nodeTitle: node.title,
      count: created.length,
    });
  }

  console.log('Curriculum lessons authored:');
  for (const row of summary) {
    console.log(`  - ${row.nodeTitle}: ${row.count} LessonBlock(s)`);
  }
  const total = summary.reduce((acc, row) => acc + row.count, 0);
  console.log(`Total LessonBlocks written: ${total}`);
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
