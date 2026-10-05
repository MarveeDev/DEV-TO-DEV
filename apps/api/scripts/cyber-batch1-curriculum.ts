/**
 * Pure, self-contained curriculum assembly and deployment planning for
 * Cybersecurity Batch 1.
 *
 * This module is intentionally separate from `curriculum.ts` (which targets
 * Computer Science + Software Engineering). It is the single source of truth
 * for the Cybersecurity Batch 1 lesson dataset and the pure planning logic
 * used by `deploy-cyber-batch1.ts` and its unit tests.
 *
 * It is pure: no database access, no environment reads, no side effects.
 *
 * Identity model:
 *   - The lesson data (`cyber-batch1.data.ts`) is keyed by `sourceNodeId`
 *     (local-development UUIDs, not assumed portable across databases).
 *   - `CYBER_BATCH1_NODES` is a SEMANTIC manifest keyed by roadmap slug +
 *     exact title, which is stable across independently-seeded databases.
 *   - `resolveCyberNodes` maps semantic manifest entries to actual production
 *     node IDs at deployment time, verifying stage and order when present.
 */
import {
  isLessonBlockType,
  validateLessonBlockContent,
} from '../src/roadmaps/lesson-block-content';
import { cyberBatch1Lessons } from './cyber-batch1.data';
import type { PilotLesson } from './pilot-lessons.data';

export const CYBER_ROADMAP_SLUG = 'cybersecurity';

export const EXPECTED_CYBER_BLOCKS = 80;

export interface CyberCurriculumNode {
  roadmapSlug: 'cybersecurity';
  /** Stable semantic identity — must match the production node title exactly. */
  exactTitle: string;
  /** Local-development UUID used by the lesson data files (authoring identity). */
  sourceNodeId: string;
  /** Expected stage, verified against production when present. */
  stage: string;
  /** Expected order within the roadmap, verified against production when present. */
  order: number;
}

/** Immutable semantic manifest of the exact 5 nodes this batch targets. */
export const CYBER_BATCH1_NODES: CyberCurriculumNode[] = [
  {
    roadmapSlug: 'cybersecurity',
    exactTitle: 'Security Fundamentals',
    sourceNodeId: 'f7a616d6-3616-4df4-94ea-be77f6f383f0',
    stage: 'FOUNDATIONS',
    order: 1,
  },
  {
    roadmapSlug: 'cybersecurity',
    exactTitle: 'OS Security',
    sourceNodeId: '93d80cc4-fc74-4a11-950b-6b3f79e95ca4',
    stage: 'FOUNDATIONS',
    order: 2,
  },
  {
    roadmapSlug: 'cybersecurity',
    exactTitle: 'Networking Basics',
    sourceNodeId: '869562e7-b073-4f9f-9743-7bac18290581',
    stage: 'FOUNDATIONS',
    order: 3,
  },
  {
    roadmapSlug: 'cybersecurity',
    exactTitle: 'Cryptography',
    sourceNodeId: 'b31648a0-941b-4fb3-a6e1-c005d88dfbb9',
    stage: 'CORE SECURITY',
    order: 4,
  },
  {
    roadmapSlug: 'cybersecurity',
    exactTitle: 'Identity & Access Management',
    sourceNodeId: 'afd163e5-e7cc-4445-a98c-46e1eeebc865',
    stage: 'CORE SECURITY',
    order: 5,
  },
];

export interface CyberProductionNode {
  id: string;
  title: string;
  roadmapSlug: string;
  stage?: string | null;
  order?: number | null;
}

export interface CyberResolutionResult {
  /** sourceNodeId -> production node id */
  mapping: Map<string, string>;
  errors: string[];
}

/**
 * Resolve each semantic manifest entry to exactly one production node using
 * roadmap slug + exact title. Zero matches or multiple matches are errors.
 * When stage/order are present on both sides, they are additionally verified.
 */
export function resolveCyberNodes(
  manifest: CyberCurriculumNode[],
  productionNodes: CyberProductionNode[],
): CyberResolutionResult {
  const byKey = new Map<string, CyberProductionNode[]>();
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
export function findDuplicateCyberEntries(
  manifest: CyberCurriculumNode[],
): CyberCurriculumNode[] {
  const seen = new Set<string>();
  const duplicates: CyberCurriculumNode[] = [];
  for (const entry of manifest) {
    const key = `${entry.roadmapSlug}\u0000${entry.exactTitle}`;
    if (seen.has(key)) duplicates.push(entry);
    seen.add(key);
  }
  return duplicates;
}

/** Assemble the Cybersecurity Batch 1 lesson dataset (5 lessons, 80 blocks). */
export function assembleCyberBatch1Lessons(): PilotLesson[] {
  return cyberBatch1Lessons;
}

export interface CyberValidationIssue {
  nodeId: string;
  nodeTitle: string;
  index: number;
  type: string;
  reason: string;
}

/** Validate every Cyber Batch 1 block against the LessonBlock content contracts. */
export function validateCyberBatch1Lessons(
  lessons: PilotLesson[],
): CyberValidationIssue[] {
  const issues: CyberValidationIssue[] = [];

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

export interface CyberDuplicateIssue {
  nodeId: string;
  position: number;
}

/** Detect duplicate (nodeId, position) pairs across the batch. */
export function findDuplicatePositions(
  lessons: PilotLesson[],
): CyberDuplicateIssue[] {
  const seen = new Set<string>();
  const duplicates: CyberDuplicateIssue[] = [];

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

export interface CyberExistingBlock {
  nodeId: string;
  type: string;
  order: number;
  content: unknown;
}

export interface CyberPlannedBlock {
  nodeId: string;
  type: string;
  order: number;
  content: unknown;
}

export interface CyberDeploymentConflict {
  nodeId: string;
  title: string;
  reason: string;
}

export interface CyberDeploymentPlan {
  conflicts: CyberDeploymentConflict[];
  toInsert: CyberPlannedBlock[];
  existing: number;
}

/**
 * Compute a deployment plan purely in memory, given the assembled source
 * lessons, the resolved source->production node mapping, and all existing
 * LessonBlocks for the resolved production nodes (fetched in a single query).
 *
 * STATE A: no existing blocks for a node -> its blocks are eligible for insert.
 * STATE B: existing blocks exactly match -> skipped (not inserted).
 * STATE C: an existing block differs -> reported as a conflict (abort).
 *
 * Never overwrites, updates, or deletes existing blocks.
 */
export function computeCyberDeploymentPlan(
  lessons: PilotLesson[],
  mapping: Map<string, string>,
  existingBlocks: CyberExistingBlock[],
): CyberDeploymentPlan {
  const existingByNode = new Map<string, CyberExistingBlock[]>();
  for (const b of existingBlocks) {
    const list = existingByNode.get(b.nodeId) ?? [];
    list.push(b);
    existingByNode.set(b.nodeId, list);
  }

  const conflicts: CyberDeploymentConflict[] = [];
  const toInsert: CyberPlannedBlock[] = [];
  let existing = 0;

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

    const existingForNode = existingByNode.get(productionNodeId) ?? [];
    existing += existingForNode.length;

    const intendedByOrder = new Map(
      lesson.blocks.map((b, i) => [
        i,
        { type: b.type, content: normalizeJson(b.content) },
      ]),
    );

    const existingByOrder = new Map<number, CyberExistingBlock[]>();
    for (const b of existingForNode) {
      const list = existingByOrder.get(b.order) ?? [];
      list.push(b);
      existingByOrder.set(b.order, list);
    }

    let conflict: string | null = null;
    for (const [order, blocks] of existingByOrder) {
      if (blocks.length > 1) {
        conflict = `duplicate existing blocks at position ${order}`;
        break;
      }
      const block = blocks[0];
      const want = intendedByOrder.get(order);
      if (!want) {
        conflict = `unexpected existing block at position ${order} (type ${block.type})`;
        break;
      }
      if (
        block.type !== want.type ||
        normalizeJson(block.content) !== want.content
      ) {
        conflict = `conflicting block at position ${order} (type ${block.type})`;
        break;
      }
    }

    if (conflict) {
      conflicts.push({
        nodeId: lesson.nodeId,
        title: lesson.nodeTitle,
        reason: conflict,
      });
      continue;
    }

    const existingOrders = new Set(existingForNode.map((b) => b.order));
    lesson.blocks.forEach((block, index) => {
      if (!existingOrders.has(index)) {
        toInsert.push({
          nodeId: productionNodeId,
          type: block.type,
          order: index,
          content: block.content,
        });
      }
    });
  }

  return { conflicts, toInsert, existing };
}
