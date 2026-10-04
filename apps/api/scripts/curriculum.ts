/**
 * Shared, pure curriculum assembly for DEV-TO-DEV authored lessons.
 *
 * This module is the single source of truth for assembling the complete
 * authored LessonBlock dataset (Computer Science + Software Engineering) from
 * the versioned lesson data files. Both the authoring script and the
 * production deployment script use this module, so the two can never drift.
 *
 * It is pure: no database access, no environment reads, no side effects.
 */

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
import { seBatch1Lessons } from './se-batch1.data';
import { seBatch2Lessons } from './se-batch2.data';
import { seBatch3Lessons } from './se-batch3.data';
import { seBatch4Lessons } from './se-batch4.data';

export interface CurriculumNode {
  roadmapSlug: 'computer-science' | 'software-engineering';
  nodeId: string;
  title: string;
}

/** Immutable manifest of the exact 30 nodes this curriculum targets. */
export const CURRICULUM_NODES: CurriculumNode[] = [
  // Computer Science
  {
    roadmapSlug: 'computer-science',
    nodeId: 'a24a7356-1a98-4a70-8db8-5b3de0cc097d',
    title: 'Computer Fundamentals',
  },
  {
    roadmapSlug: 'computer-science',
    nodeId: 'f02f2841-c820-4dee-854b-0e7b19ceb0ed',
    title: 'Binary & Number Systems',
  },
  {
    roadmapSlug: 'computer-science',
    nodeId: '4400fc11-9425-4ccf-b170-82e4a43e7aec',
    title: 'Discrete Mathematics',
  },
  {
    roadmapSlug: 'computer-science',
    nodeId: 'dad87655-2c48-4ac3-99ee-8b82d093d4d6',
    title: 'Programming Fundamentals',
  },
  {
    roadmapSlug: 'computer-science',
    nodeId: '99bbe1e6-ff75-4f32-88d7-04597543136a',
    title: 'Git & Version Control',
  },
  {
    roadmapSlug: 'computer-science',
    nodeId: '1476172e-3ba2-43ee-b0d0-b90c3ff043a1',
    title: 'Arrays & Linked Lists',
  },
  {
    roadmapSlug: 'computer-science',
    nodeId: 'e4e1bd7b-8617-4dac-b243-1aad7a5756ac',
    title: 'Stacks & Queues',
  },
  {
    roadmapSlug: 'computer-science',
    nodeId: 'b3951972-a9f2-4435-9301-c9d73c2cdebf',
    title: 'Trees & Graphs',
  },
  {
    roadmapSlug: 'computer-science',
    nodeId: '9b01e6a5-71a4-46e6-8ec2-8ca79bbb17af',
    title: 'Complexity & Big O',
  },
  {
    roadmapSlug: 'computer-science',
    nodeId: 'df74e250-d57b-4212-be6e-d3c131ab6671',
    title: 'Sorting & Searching',
  },
  {
    roadmapSlug: 'computer-science',
    nodeId: 'fc792f8a-9ba5-4c93-9a77-7cf9969fb98b',
    title: 'Dynamic Programming',
  },
  {
    roadmapSlug: 'computer-science',
    nodeId: 'f76fe362-1457-4399-b1a7-cb3d94715f0f',
    title: 'Computer Architecture',
  },
  {
    roadmapSlug: 'computer-science',
    nodeId: '2ed7de72-3647-47a5-afab-140788e2470e',
    title: 'Operating Systems',
  },
  {
    roadmapSlug: 'computer-science',
    nodeId: '6814e0ae-687b-4e08-97ad-6b0a7088a766',
    title: 'Databases',
  },
  {
    roadmapSlug: 'computer-science',
    nodeId: '26e7e2ed-2214-4325-918a-cad5c513c1a6',
    title: 'Computer Networks',
  },
  // Software Engineering
  {
    roadmapSlug: 'software-engineering',
    nodeId: 'a45fe94d-0c97-4bb7-a5a6-8f5a554abfee',
    title: 'Language Fundamentals',
  },
  {
    roadmapSlug: 'software-engineering',
    nodeId: 'cd4efb1a-5f17-45dc-95b0-8614505934b9',
    title: 'Version Control (Git)',
  },
  {
    roadmapSlug: 'software-engineering',
    nodeId: '27514966-1d6b-456b-ab33-06599b489611',
    title: 'Web Fundamentals',
  },
  {
    roadmapSlug: 'software-engineering',
    nodeId: '9880296a-723e-4d55-bf22-1e04e8643d86',
    title: 'Frontend Frameworks',
  },
  {
    roadmapSlug: 'software-engineering',
    nodeId: '90b878b8-a560-4c22-a451-1c37a3aaa77b',
    title: 'Backend Fundamentals',
  },
  {
    roadmapSlug: 'software-engineering',
    nodeId: 'bf11cdbf-55f7-4ead-a9a2-9f2b513876fc',
    title: 'RESTful APIs',
  },
  {
    roadmapSlug: 'software-engineering',
    nodeId: 'c38dcf96-8a4c-43af-8ab2-f6ce92dd05bf',
    title: 'Databases & ORMs',
  },
  {
    roadmapSlug: 'software-engineering',
    nodeId: '88b4feed-c9a8-4668-8fd3-b8ecfd31da90',
    title: 'Unit Testing',
  },
  {
    roadmapSlug: 'software-engineering',
    nodeId: '244fea6b-7880-4a11-a670-6dd16b088e0a',
    title: 'Integration & E2E Testing',
  },
  {
    roadmapSlug: 'software-engineering',
    nodeId: '7e07c1db-3136-41b3-b7d3-ff6bdf77d389',
    title: 'Clean Code & Refactoring',
  },
  {
    roadmapSlug: 'software-engineering',
    nodeId: 'd8968cd1-a02f-4645-ab53-50910690cc2d',
    title: 'Design Patterns',
  },
  {
    roadmapSlug: 'software-engineering',
    nodeId: '0c9a8b25-2a9c-4a75-b586-9b9826144d85',
    title: 'System Architecture',
  },
  {
    roadmapSlug: 'software-engineering',
    nodeId: 'e24fed91-6df9-48c5-bcbd-4b329880ffe5',
    title: 'CI/CD',
  },
  {
    roadmapSlug: 'software-engineering',
    nodeId: '7a4d4811-a1c4-4d9f-803d-dd4fe08e73e9',
    title: 'Containerization',
  },
  {
    roadmapSlug: 'software-engineering',
    nodeId: '57ade220-9c75-4015-ae6c-8b57e4b4695c',
    title: 'Deployment & Hosting',
  },
];

export const EXPECTED_CS_BLOCKS = 200;
export const EXPECTED_SE_BLOCKS = 271;
export const EXPECTED_TOTAL_BLOCKS = EXPECTED_CS_BLOCKS + EXPECTED_SE_BLOCKS;

export const CS_ROADMAP_SLUG = 'computer-science';
export const SE_ROADMAP_SLUG = 'software-engineering';

/**
 * Merge rich SECTION enrichment blocks into each lesson, inserting them right
 * after the lesson's EXPLANATION block. This matches the historical authoring
 * behavior exactly; the base lesson blocks are never altered.
 */
export function enrichLessons(
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

/** Assemble the complete authored curriculum (30 lessons, 471 blocks). */
export function assembleCurriculumLessons(): PilotLesson[] {
  const enrichedPilot = enrichLessons(pilotLessons, pilotLessonEnrichment);
  return [
    ...enrichedPilot,
    ...csFoundationLessons,
    ...csAdvancedLessons,
    ...seBatch1Lessons,
    ...seBatch2Lessons,
    ...seBatch3Lessons,
    ...seBatch4Lessons,
  ];
}

export interface ValidationIssue {
  nodeId: string;
  nodeTitle: string;
  index: number;
  type: string;
  reason: string;
}

/** Validate every assembled block against the LessonBlock content contracts. */
export function validateAssembledLessons(
  lessons: PilotLesson[],
): ValidationIssue[] {
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

export interface DuplicateIssue {
  nodeId: string;
  position: number;
}

/** Detect duplicate (nodeId, position) pairs across the assembled curriculum. */
export function findDuplicatePositions(
  lessons: PilotLesson[],
): DuplicateIssue[] {
  const seen = new Set<string>();
  const duplicates: DuplicateIssue[] = [];

  for (const lesson of lessons) {
    lesson.blocks.forEach((_block, index) => {
      const key = `${lesson.nodeId}:${index}`;
      if (seen.has(key)) {
        duplicates.push({ nodeId: lesson.nodeId, position: index });
      }
      seen.add(key);
    });
  }

  return duplicates;
}

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortObjectKeys);
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      out[key] = sortObjectKeys((value as Record<string, unknown>)[key]);
    }
    return out;
  }
  return value;
}

/**
 * Deterministic JSON normalization for content comparison. Object keys are
 * sorted (so semantically-identical objects compare equal regardless of key
 * order), while arrays retain their meaningful order.
 */
export function normalizeJson(value: unknown): string {
  return JSON.stringify(sortObjectKeys(value));
}
