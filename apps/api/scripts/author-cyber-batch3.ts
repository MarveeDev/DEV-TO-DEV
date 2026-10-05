/**
 * DEV-TO-DEV Curriculum Authoring — Cybersecurity Batch 3 LessonBlock writer
 * (development only).
 *
 * This is an isolated, versioned development script (NOT part of the running
 * application and never executed during build/startup/tests). It writes the
 * Cybersecurity Batch 3 lessons (see `cyber-batch3.data.ts`) into the
 * `LessonBlock` table for the final four Cybersecurity nodes.
 *
 * It is intentionally separate from `author-cyber-lessons.ts` (Batch 1),
 * `author-cyber-batch2.ts` (Batch 2), and `author-pilot-lessons.ts` (CS/SE),
 * so each batch is authored independently and no batch ever alters another.
 *
 * Guarantees:
 *   - Reads only: RoadmapNode lookups are used solely to confirm the target
 *     node exists and its title matches. No Roadmap, RoadmapNode,
 *     RoadmapProgress, prerequisite, or book/video field is ever modified.
 *   - Validates every block against the LessonBlock content contract before
 *     writing. If anything is malformed, the script aborts without writing.
 *   - Idempotent: for each node it deletes any existing LessonBlocks for that
 *     node and recreates them, so re-running never duplicates or leaves stale
 *     blocks.
 *
 * Usage (from apps/api):
 *   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/devtodev?schema=public" \
 *     pnpm exec ts-node scripts/author-cyber-batch3.ts
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
import { cyberBatch3Lessons } from './cyber-batch3.data';
import type { PilotLesson } from './pilot-lessons.data';

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

interface ValidationIssue {
  nodeId: string;
  nodeTitle: string;
  index: number;
  type: string;
  reason: string;
}

function validateCyberLessons(lessons: PilotLesson[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const lesson of lessons) {
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

      if (validateLessonBlockContent(block.type, block.content) === null) {
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
  const lessons = cyberBatch3Lessons;

  const issues = validateCyberLessons(lessons);
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

  for (const lesson of lessons) {
    const node = await prisma.roadmapNode.findUnique({
      where: { id: lesson.nodeId },
      select: { id: true, title: true },
    });

    if (!node) {
      throw new Error(
        `Cybersecurity node not found: ${lesson.nodeTitle} (${lesson.nodeId})`,
      );
    }

    if (node.title !== lesson.nodeTitle) {
      throw new Error(
        `Title mismatch for ${lesson.nodeId}: expected "${lesson.nodeTitle}", found "${node.title}"`,
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

  console.log('Cybersecurity Batch 3 lessons authored:');
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
