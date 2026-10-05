/**
 * Pure, self-contained curriculum assembly and deployment planning for
 * Cybersecurity Batch 2.
 *
 * This module is intentionally separate from `cyber-batch1-curriculum.ts`
 * (Batch 1) and `curriculum.ts` (CS/SE). It is the single source of truth for
 * the Cybersecurity Batch 2 lesson dataset and the pure planning logic used by
 * `deploy-cyber-batch2.ts` and its unit tests.
 *
 * It is pure: no database access, no environment reads, no side effects.
 *
 * Identity model:
 *   - The lesson data (`cyber-batch2.data.ts`) is keyed by `sourceNodeId`
 *     (local-development UUIDs, not assumed portable across databases).
 *   - `CYBER_BATCH2_NODES` is a SEMANTIC manifest keyed by roadmap slug +
 *     exact title, which is stable across independently-seeded databases.
 *   - `resolveCyberBatch2Nodes` maps semantic manifest entries to actual
 *     production node IDs at deployment time, verifying stage and order when
 *     present.
 */
import {
  isLessonBlockType,
  validateLessonBlockContent,
} from '../src/roadmaps/lesson-block-content';
import { cyberBatch2Lessons } from './cyber-batch2.data';
import type { PilotLesson } from './pilot-lessons.data';

export const CYBER_ROADMAP_SLUG = 'cybersecurity';

export const EXPECTED_CYBER_BATCH2_BLOCKS = 85;

export interface CyberBatch2CurriculumNode {
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

/** Immutable semantic manifest of the exact 4 nodes this batch targets. */
export const CYBER_BATCH2_NODES: CyberBatch2CurriculumNode[] = [
  {
    roadmapSlug: 'cybersecurity',
    exactTitle: 'Network Security',
    sourceNodeId: 'd8b0a252-1367-4832-a257-91ca4f803fc3',
    stage: 'INFRASTRUCTURE',
    order: 6,
  },
  {
    roadmapSlug: 'cybersecurity',
    exactTitle: 'Cloud Security',
    sourceNodeId: '6a3f94e1-a6ef-4195-b915-ed779733a7b9',
    stage: 'INFRASTRUCTURE',
    order: 7,
  },
  {
    roadmapSlug: 'cybersecurity',
    exactTitle: 'Web Application Security',
    sourceNodeId: '9859e4c7-dd38-4d30-91ff-4263370646aa',
    stage: 'APPSEC',
    order: 8,
  },
  {
    roadmapSlug: 'cybersecurity',
    exactTitle: 'Secure Coding & SAST',
    sourceNodeId: '997b723b-b82f-44e5-a898-d34308750d4e',
    stage: 'APPSEC',
    order: 9,
  },
];

export interface CyberBatch2ProductionNode {
  id: string;
  title: string;
  roadmapSlug: string;
  stage?: string | null;
  order?: number | null;
}

export interface CyberBatch2ResolutionResult {
  /** sourceNodeId -> production node id */
  mapping: Map<string, string>;
  errors: string[];
}

/**
 * Resolve each semantic manifest entry to exactly one production node using
 * roadmap slug + exact title. Zero matches or multiple matches are errors.
 * When stage/order are present on both sides, they are additionally verified.
 */
export function resolveCyberBatch2Nodes(
  manifest: CyberBatch2CurriculumNode[],
  productionNodes: CyberBatch2ProductionNode[],
): CyberBatch2ResolutionResult {
  const byKey = new Map<string, CyberBatch2ProductionNode[]>();
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
export function findDuplicateCyberBatch2Entries(
  manifest: CyberBatch2CurriculumNode[],
): CyberBatch2CurriculumNode[] {
  const seen = new Set<string>();
  const duplicates: CyberBatch2CurriculumNode[] = [];
  for (const entry of manifest) {
    const key = `${entry.roadmapSlug}\u0000${entry.exactTitle}`;
    if (seen.has(key)) duplicates.push(entry);
    seen.add(key);
  }
  return duplicates;
}

/** Assemble the Cybersecurity Batch 2 lesson dataset (4 lessons, 85 blocks). */
export function assembleCyberBatch2Lessons(): PilotLesson[] {
  return cyberBatch2Lessons;
}

export interface CyberBatch2ValidationIssue {
  nodeId: string;
  nodeTitle: string;
  index: number;
  type: string;
  reason: string;
}

/** Validate every Cyber Batch 2 block against the LessonBlock content contracts. */
export function validateCyberBatch2Lessons(
  lessons: PilotLesson[],
): CyberBatch2ValidationIssue[] {
  const issues: CyberBatch2ValidationIssue[] = [];

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

export interface CyberBatch2DuplicateIssue {
  nodeId: string;
  position: number;
}

/** Detect duplicate (nodeId, position) pairs across the batch. */
export function findDuplicatePositions(
  lessons: PilotLesson[],
): CyberBatch2DuplicateIssue[] {
  const seen = new Set<string>();
  const duplicates: CyberBatch2DuplicateIssue[] = [];

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

export interface CyberBatch2ExistingBlock {
  nodeId: string;
  type: string;
  order: number;
  content: unknown;
}

export interface CyberBatch2PlannedBlock {
  nodeId: string;
  type: string;
  order: number;
  content: unknown;
}

export interface CyberBatch2DeploymentConflict {
  nodeId: string;
  title: string;
  reason: string;
}

export interface CyberBatch2DeploymentPlan {
  conflicts: CyberBatch2DeploymentConflict[];
  toInsert: CyberBatch2PlannedBlock[];
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
export function computeCyberBatch2DeploymentPlan(
  lessons: PilotLesson[],
  mapping: Map<string, string>,
  existingBlocks: CyberBatch2ExistingBlock[],
): CyberBatch2DeploymentPlan {
  const existingByNode = new Map<string, CyberBatch2ExistingBlock[]>();
  for (const b of existingBlocks) {
    const list = existingByNode.get(b.nodeId) ?? [];
    list.push(b);
    existingByNode.set(b.nodeId, list);
  }

  const conflicts: CyberBatch2DeploymentConflict[] = [];
  const toInsert: CyberBatch2PlannedBlock[] = [];
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

    const existingByOrder = new Map<number, CyberBatch2ExistingBlock[]>();
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

export interface CyberBatch2NodeSummary {
  sourceNodeId: string;
  title: string;
  existing: number;
  intended: number;
  toInsert: number;
}

/**
 * Compute a per-node summary for reporting. Assumes the conflict check has
 * already passed; `toInsert` is therefore `intended - existing` per node.
 */
export function summarizeCyberBatch2(
  lessons: PilotLesson[],
  mapping: Map<string, string>,
  existingBlocks: CyberBatch2ExistingBlock[],
): CyberBatch2NodeSummary[] {
  const existingByNode = new Map<string, number>();
  for (const b of existingBlocks) {
    existingByNode.set(b.nodeId, (existingByNode.get(b.nodeId) ?? 0) + 1);
  }

  return lessons.map((lesson) => {
    const prodId = mapping.get(lesson.nodeId);
    const existing = prodId ? (existingByNode.get(prodId) ?? 0) : 0;
    const intended = lesson.blocks.length;
    return {
      sourceNodeId: lesson.nodeId,
      title: lesson.nodeTitle,
      existing,
      intended,
      toInsert: Math.max(intended - existing, 0),
    };
  });
}
