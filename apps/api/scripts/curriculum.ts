/**
 * Shared, pure curriculum assembly for DEV-TO-DEV authored lessons.
 *
 * This module is the single source of truth for assembling the complete
 * authored LessonBlock dataset (Computer Science + Software Engineering) from
 * the versioned lesson data files. Both the authoring script and the
 * production deployment script use this module, so the two can never drift.
 *
 * It is pure: no database access, no environment reads, no side effects.
 *
 * Identity model:
 *   - The lesson data files are keyed by `sourceNodeId` (the local-development
 *     UUID used during authoring). Those IDs are NOT assumed to be portable
 *     across databases.
 *   - `CURRICULUM_NODES` is a SEMANTIC manifest keyed by roadmap slug + exact
 *     title, which is stable across independently-seeded databases.
 *   - `resolveSemanticNodes` maps semantic manifest entries to actual
 *     production node IDs at deployment time.
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
  /** Stable semantic identity — must match the production node title exactly. */
  exactTitle: string;
  /** Local-development UUID used by the lesson data files (authoring identity). */
  sourceNodeId: string;
  /** Expected stage, verified against production when present. */
  stage: string;
  /** Expected order within the roadmap, verified against production when present. */
  order: number;
}

/** Immutable semantic manifest of the exact 30 nodes this curriculum targets. */
export const CURRICULUM_NODES: CurriculumNode[] = [
  // Computer Science
  {
    roadmapSlug: 'computer-science',
    exactTitle: 'Computer Fundamentals',
    sourceNodeId: 'a24a7356-1a98-4a70-8db8-5b3de0cc097d',
    stage: 'FOUNDATIONS',
    order: 1,
  },
  {
    roadmapSlug: 'computer-science',
    exactTitle: 'Binary & Number Systems',
    sourceNodeId: 'f02f2841-c820-4dee-854b-0e7b19ceb0ed',
    stage: 'FOUNDATIONS',
    order: 2,
  },
  {
    roadmapSlug: 'computer-science',
    exactTitle: 'Discrete Mathematics',
    sourceNodeId: '4400fc11-9425-4ccf-b170-82e4a43e7aec',
    stage: 'FOUNDATIONS',
    order: 3,
  },
  {
    roadmapSlug: 'computer-science',
    exactTitle: 'Programming Fundamentals',
    sourceNodeId: 'dad87655-2c48-4ac3-99ee-8b82d093d4d6',
    stage: 'PROGRAMMING',
    order: 4,
  },
  {
    roadmapSlug: 'computer-science',
    exactTitle: 'Git & Version Control',
    sourceNodeId: '99bbe1e6-ff75-4f32-88d7-04597543136a',
    stage: 'PROGRAMMING',
    order: 5,
  },
  {
    roadmapSlug: 'computer-science',
    exactTitle: 'Arrays & Linked Lists',
    sourceNodeId: '1476172e-3ba2-43ee-b0d0-b90c3ff043a1',
    stage: 'DATA STRUCTURES',
    order: 6,
  },
  {
    roadmapSlug: 'computer-science',
    exactTitle: 'Stacks & Queues',
    sourceNodeId: 'e4e1bd7b-8617-4dac-b243-1aad7a5756ac',
    stage: 'DATA STRUCTURES',
    order: 7,
  },
  {
    roadmapSlug: 'computer-science',
    exactTitle: 'Trees & Graphs',
    sourceNodeId: 'b3951972-a9f2-4435-9301-c9d73c2cdebf',
    stage: 'DATA STRUCTURES',
    order: 8,
  },
  {
    roadmapSlug: 'computer-science',
    exactTitle: 'Complexity & Big O',
    sourceNodeId: '9b01e6a5-71a4-46e6-8ec2-8ca79bbb17af',
    stage: 'ALGORITHMS',
    order: 9,
  },
  {
    roadmapSlug: 'computer-science',
    exactTitle: 'Sorting & Searching',
    sourceNodeId: 'df74e250-d57b-4212-be6e-d3c131ab6671',
    stage: 'ALGORITHMS',
    order: 10,
  },
  {
    roadmapSlug: 'computer-science',
    exactTitle: 'Dynamic Programming',
    sourceNodeId: 'fc792f8a-9ba5-4c93-9a77-7cf9969fb98b',
    stage: 'ALGORITHMS',
    order: 11,
  },
  {
    roadmapSlug: 'computer-science',
    exactTitle: 'Computer Architecture',
    sourceNodeId: 'f76fe362-1457-4399-b1a7-cb3d94715f0f',
    stage: 'CORE COMPUTER SCIENCE',
    order: 12,
  },
  {
    roadmapSlug: 'computer-science',
    exactTitle: 'Operating Systems',
    sourceNodeId: '2ed7de72-3647-47a5-afab-140788e2470e',
    stage: 'CORE COMPUTER SCIENCE',
    order: 13,
  },
  {
    roadmapSlug: 'computer-science',
    exactTitle: 'Databases',
    sourceNodeId: '6814e0ae-687b-4e08-97ad-6b0a7088a766',
    stage: 'CORE COMPUTER SCIENCE',
    order: 14,
  },
  {
    roadmapSlug: 'computer-science',
    exactTitle: 'Computer Networks',
    sourceNodeId: '26e7e2ed-2214-4325-918a-cad5c513c1a6',
    stage: 'CORE COMPUTER SCIENCE',
    order: 15,
  },
  // Software Engineering
  {
    roadmapSlug: 'software-engineering',
    exactTitle: 'Language Fundamentals',
    sourceNodeId: 'a45fe94d-0c97-4bb7-a5a6-8f5a554abfee',
    stage: 'PROGRAMMING',
    order: 1,
  },
  {
    roadmapSlug: 'software-engineering',
    exactTitle: 'Version Control (Git)',
    sourceNodeId: 'cd4efb1a-5f17-45dc-95b0-8614505934b9',
    stage: 'PROGRAMMING',
    order: 2,
  },
  {
    roadmapSlug: 'software-engineering',
    exactTitle: 'Web Fundamentals',
    sourceNodeId: '27514966-1d6b-456b-ab33-06599b489611',
    stage: 'FRONTEND',
    order: 3,
  },
  {
    roadmapSlug: 'software-engineering',
    exactTitle: 'Frontend Frameworks',
    sourceNodeId: '9880296a-723e-4d55-bf22-1e04e8643d86',
    stage: 'FRONTEND',
    order: 4,
  },
  {
    roadmapSlug: 'software-engineering',
    exactTitle: 'Backend Fundamentals',
    sourceNodeId: '90b878b8-a560-4c22-a451-1c37a3aaa77b',
    stage: 'BACKEND',
    order: 5,
  },
  {
    roadmapSlug: 'software-engineering',
    exactTitle: 'RESTful APIs',
    sourceNodeId: 'bf11cdbf-55f7-4ead-a9a2-9f2b513876fc',
    stage: 'BACKEND',
    order: 6,
  },
  {
    roadmapSlug: 'software-engineering',
    exactTitle: 'Databases & ORMs',
    sourceNodeId: 'c38dcf96-8a4c-43af-8ab2-f6ce92dd05bf',
    stage: 'BACKEND',
    order: 7,
  },
  {
    roadmapSlug: 'software-engineering',
    exactTitle: 'Unit Testing',
    sourceNodeId: '88b4feed-c9a8-4668-8fd3-b8ecfd31da90',
    stage: 'TESTING',
    order: 8,
  },
  {
    roadmapSlug: 'software-engineering',
    exactTitle: 'Integration & E2E Testing',
    sourceNodeId: '244fea6b-7880-4a11-a670-6dd16b088e0a',
    stage: 'TESTING',
    order: 9,
  },
  {
    roadmapSlug: 'software-engineering',
    exactTitle: 'Clean Code & Refactoring',
    sourceNodeId: '7e07c1db-3136-41b3-b7d3-ff6bdf77d389',
    stage: 'DESIGN',
    order: 10,
  },
  {
    roadmapSlug: 'software-engineering',
    exactTitle: 'Design Patterns',
    sourceNodeId: 'd8968cd1-a02f-4645-ab53-50910690cc2d',
    stage: 'DESIGN',
    order: 11,
  },
  {
    roadmapSlug: 'software-engineering',
    exactTitle: 'System Architecture',
    sourceNodeId: '0c9a8b25-2a9c-4a75-b586-9b9826144d85',
    stage: 'SYSTEM DESIGN',
    order: 12,
  },
  {
    roadmapSlug: 'software-engineering',
    exactTitle: 'CI/CD',
    sourceNodeId: 'e24fed91-6df9-48c5-bcbd-4b329880ffe5',
    stage: 'DEVOPS',
    order: 13,
  },
  {
    roadmapSlug: 'software-engineering',
    exactTitle: 'Containerization',
    sourceNodeId: '7a4d4811-a1c4-4d9f-803d-dd4fe08e73e9',
    stage: 'DEVOPS',
    order: 14,
  },
  {
    roadmapSlug: 'software-engineering',
    exactTitle: 'Deployment & Hosting',
    sourceNodeId: '57ade220-9c75-4015-ae6c-8b57e4b4695c',
    stage: 'DEVOPS',
    order: 15,
  },
];

export const EXPECTED_CS_BLOCKS = 200;
export const EXPECTED_SE_BLOCKS = 271;
export const EXPECTED_TOTAL_BLOCKS = EXPECTED_CS_BLOCKS + EXPECTED_SE_BLOCKS;

export const CS_ROADMAP_SLUG = 'computer-science';
export const SE_ROADMAP_SLUG = 'software-engineering';

export interface ProductionNode {
  id: string;
  title: string;
  roadmapSlug: string;
  stage?: string | null;
  order?: number | null;
}

export interface ResolutionResult {
  /** sourceNodeId -> production node id */
  mapping: Map<string, string>;
  errors: string[];
}

/**
 * Resolve each semantic manifest entry to exactly one production node using
 * roadmap slug + exact title. Zero matches or multiple matches are errors.
 * When stage/order are present on both sides, they are additionally verified.
 */
export function resolveSemanticNodes(
  manifest: CurriculumNode[],
  productionNodes: ProductionNode[],
): ResolutionResult {
  const byKey = new Map<string, ProductionNode[]>();
  for (const node of productionNodes) {
    const key = `${node.roadmapSlug}\u0000${node.title}`;
    const list = byKey.get(key) ?? [];
    list.push(node);
    byKey.set(key, list);
  }

  const mapping = new Map<string, string>();
  const errors: string[] = [];

  for (const entry of manifest) {
    const key = `${entry.roadmapSlug}\u0000${entry.exactTitle}`;
    const matches = byKey.get(key) ?? [];

    if (matches.length === 0) {
      errors.push(
        `no production node for ${entry.roadmapSlug} / "${entry.exactTitle}" (source ${entry.sourceNodeId})`,
      );
      continue;
    }
    if (matches.length > 1) {
      errors.push(
        `ambiguous: ${matches.length} production nodes for ${entry.roadmapSlug} / "${entry.exactTitle}"`,
      );
      continue;
    }

    const node = matches[0];
    if (entry.stage && node.stage != null && node.stage !== entry.stage) {
      errors.push(
        `stage mismatch for "${entry.exactTitle}": expected ${entry.stage}, got ${node.stage}`,
      );
      continue;
    }
    if (entry.order && node.order != null && node.order !== entry.order) {
      errors.push(
        `order mismatch for "${entry.exactTitle}": expected ${entry.order}, got ${node.order}`,
      );
      continue;
    }

    mapping.set(entry.sourceNodeId, node.id);
  }

  return { mapping, errors };
}

/** Detect duplicate (roadmapSlug + exactTitle) entries in the manifest. */
export function findDuplicateSemanticEntries(
  manifest: CurriculumNode[],
): CurriculumNode[] {
  const seen = new Set<string>();
  const duplicates: CurriculumNode[] = [];
  for (const entry of manifest) {
    const key = `${entry.roadmapSlug}\u0000${entry.exactTitle}`;
    if (seen.has(key)) duplicates.push(entry);
    seen.add(key);
  }
  return duplicates;
}

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
