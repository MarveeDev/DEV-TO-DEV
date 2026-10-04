/**
 * DEV-TO-DEV Curriculum Authoring Pilot — LessonBlock writer.
 *
 * This is an isolated, versioned development script (NOT part of the running
 * application and never executed during build/startup/tests). It writes the
 * structured lessons defined in `pilot-lessons.data.ts` into the `LessonBlock`
 * table for the selected Computer Science pilot nodes.
 *
 * Guarantees:
 *   - Reads only: RoadmapNode lookups are used solely to confirm the target
 *     node exists. No Roadmap, RoadmapNode, RoadmapProgress, prerequisite, or
 *     book/video field is ever modified.
 *   - Validates: every block's content is checked against the LessonBlock
 *     content contract BEFORE any write. If anything is malformed, the script
 *     aborts without touching the database.
 *   - Idempotent: for each pilot node it deletes any existing LessonBlocks for
 *     that node and then recreates them, so re-running never duplicates or
 *     leaves stale blocks.
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
  isLessonBlockType,
  validateLessonBlockContent,
} from '../src/roadmaps/lesson-block-content';
import {
  pilotLessons,
  PilotLesson,
  LessonBlockInput,
} from './pilot-lessons.data';
import { pilotLessonEnrichment } from './pilot-lessons-enrichment.data';
import { csFoundationLessons } from './cs-foundations.data';
import { csAdvancedLessons } from './cs-advanced.data';

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

type ValidationIssue = {
  nodeId: string;
  nodeTitle: string;
  index: number;
  type: string;
  reason: string;
};

/**
 * Merges rich SECTION enrichment blocks into each lesson, inserting them right
 * after the lesson's EXPLANATION block so the "Learn" tab reads: Explanation →
 * rich sections → Syntax → Examples. The base lesson blocks are left untouched.
 */
function enrichLessons(
  lessons: PilotLesson[],
  enrichment: Record<string, LessonBlockInput[]>,
): PilotLesson[] {
  return lessons.map((lesson) => {
    const extra = enrichment[lesson.nodeId];
    if (!extra || extra.length === 0) return lesson;

    const blocks = [...lesson.blocks];
    const insertAt = blocks.findIndex((b) => b.type === 'EXPLANATION');
    const index = insertAt >= 0 ? insertAt + 1 : 0;
    blocks.splice(index, 0, ...extra);

    return { ...lesson, blocks };
  });
}

const enrichedLessons = enrichLessons(pilotLessons, pilotLessonEnrichment);
const allLessons = [
  ...enrichedLessons,
  ...csFoundationLessons,
  ...csAdvancedLessons,
];

function validateAll(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const lesson of allLessons) {
    lesson.blocks.forEach((block, index) => {
      if (!isLessonBlockType(block.type)) {
        issues.push({
          nodeId: lesson.nodeId,
          nodeTitle: lesson.nodeTitle,
          index,
          type: String(block.type),
          reason: 'unknown block type',
        });
        return;
      }

      const content = validateLessonBlockContent(block.type, block.content);
      if (content === null) {
        issues.push({
          nodeId: lesson.nodeId,
          nodeTitle: lesson.nodeTitle,
          index,
          type: block.type,
          reason: 'content failed type-specific validation',
        });
      }
    });
  }

  return issues;
}

async function main(): Promise<void> {
  const issues = validateAll();
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
        `Pilot node not found: ${lesson.nodeTitle} (${lesson.nodeId})`,
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

  console.log('Pilot lessons authored:');
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
