/**
 * Pure, self-contained curriculum assembly and deployment planning for
 * AI & Machine Learning Batch 3.
 *
 * This module is intentionally separate from the CS/SE (`curriculum.ts`),
 * Cybersecurity (`cyber-batch*-curriculum.ts`), and AI/ML Batch 1/2
 * (`ai-batch1-curriculum.ts`, `ai-batch2-curriculum.ts`) tooling. It is the
 * single source of truth for the AI/ML Batch 3 lesson dataset and the pure
 * planning logic used by `deploy-ai-batch3.ts` and its unit tests.
 *
 * It is pure: no database access, no environment reads, no side effects.
 *
 * Identity model:
 *   - The lesson data (`ai-batch3.data.ts`) is keyed by `sourceNodeId`
 *     (local-development UUIDs, not assumed portable across databases).
 *   - `AI_BATCH3_NODES` is a SEMANTIC manifest keyed by roadmap slug + exact
 *     title, which is stable across independently-seeded databases.
 *   - `resolveAiBatch3Nodes` maps semantic manifest entries to actual
 *     production node IDs at deployment time, verifying stage and order when
 *     present.
 */
import {
  isLessonBlockType,
  validateLessonBlockContent,
} from '../src/roadmaps/lesson-block-content';
import { aiBatch3Lessons } from './ai-batch3.data';
import type { PilotLesson } from './pilot-lessons.data';

export const AI_ROADMAP_SLUG = 'ai-machine-learning';

export const EXPECTED_AI_BATCH3_BLOCKS = 119;

export interface AiBatch3CurriculumNode {
  roadmapSlug: 'ai-machine-learning';
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
export const AI_BATCH3_NODES: AiBatch3CurriculumNode[] = [
  {
    roadmapSlug: 'ai-machine-learning',
    exactTitle: 'Deep Learning Basics',
    sourceNodeId: 'd5932c0c-0a1e-474e-88c0-476623b7b618',
    stage: 'DEEP LEARNING',
    order: 8,
  },
  {
    roadmapSlug: 'ai-machine-learning',
    exactTitle: 'Computer Vision',
    sourceNodeId: '71926d4f-6c4e-4a1a-a254-728a86f1d8cb',
    stage: 'SPECIALIZATION',
    order: 9,
  },
  {
    roadmapSlug: 'ai-machine-learning',
    exactTitle: 'Natural Language Processing',
    sourceNodeId: 'fcd3765e-7aea-4cce-b1e8-4637a4614a50',
    stage: 'SPECIALIZATION',
    order: 10,
  },
  {
    roadmapSlug: 'ai-machine-learning',
    exactTitle: 'Generative AI & LLMs',
    sourceNodeId: '3de91561-6096-43ce-bfc0-0c0900e4e1d1',
    stage: 'SPECIALIZATION',
    order: 11,
  },
  {
    roadmapSlug: 'ai-machine-learning',
    exactTitle: 'MLOps',
    sourceNodeId: 'cdd2f451-efdc-4247-9ca6-fe208af4bfdb',
    stage: 'PRODUCTION',
    order: 12,
  },
];

export interface AiBatch3ProductionNode {
  id: string;
  title: string;
  roadmapSlug: string;
  stage?: string | null;
  order?: number | null;
}

export interface AiBatch3ResolutionResult {
  /** sourceNodeId -> production node id */
  mapping: Map<string, string>;
  errors: string[];
}

/**
 * Resolve each semantic manifest entry to exactly one production node using
 * roadmap slug + exact title. Zero matches or multiple matches are errors.
 * When stage/order are present on both sides, they are additionally verified.
 */
export function resolveAiBatch3Nodes(
  manifest: AiBatch3CurriculumNode[],
  productionNodes: AiBatch3ProductionNode[],
): AiBatch3ResolutionResult {
  const byKey = new Map<string, AiBatch3ProductionNode[]>();
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
export function findDuplicateAiBatch3Entries(
  manifest: AiBatch3CurriculumNode[],
): AiBatch3CurriculumNode[] {
  const seen = new Set<string>();
  const duplicates: AiBatch3CurriculumNode[] = [];
  for (const entry of manifest) {
    const key = `${entry.roadmapSlug}\u0000${entry.exactTitle}`;
    if (seen.has(key)) duplicates.push(entry);
    seen.add(key);
  }
  return duplicates;
}

/** Assemble the AI/ML Batch 3 lesson dataset (5 lessons, 119 blocks). */
export function assembleAiBatch3Lessons(): PilotLesson[] {
  return aiBatch3Lessons;
}

export interface AiBatch3ValidationIssue {
  nodeId: string;
  nodeTitle: string;
  index: number;
  type: string;
  reason: string;
}

/** Validate every AI/ML Batch 3 block against the LessonBlock content contracts. */
export function validateAiBatch3Lessons(
  lessons: PilotLesson[],
): AiBatch3ValidationIssue[] {
  const issues: AiBatch3ValidationIssue[] = [];

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

export interface AiBatch3DuplicateIssue {
  nodeId: string;
  position: number;
}

/** Detect duplicate (nodeId, position) pairs across the batch. */
export function findDuplicatePositions(
  lessons: PilotLesson[],
): AiBatch3DuplicateIssue[] {
  const seen = new Set<string>();
  const duplicates: AiBatch3DuplicateIssue[] = [];

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

export interface AiBatch3ExistingBlock {
  nodeId: string;
  type: string;
  order: number;
  content: unknown;
}

export interface AiBatch3PlannedBlock {
  nodeId: string;
  type: string;
  order: number;
  content: unknown;
}

export interface AiBatch3DeploymentConflict {
  nodeId: string;
  title: string;
  reason: string;
}

export interface AiBatch3DeploymentPlan {
  conflicts: AiBatch3DeploymentConflict[];
  toInsert: AiBatch3PlannedBlock[];
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
 * Never overwrites, updates, or deletes existing blocks. Existing blocks on
 * nodes outside the mapping (e.g., Batch 1/2) are simply ignored.
 */
export function computeAiBatch3DeploymentPlan(
  lessons: PilotLesson[],
  mapping: Map<string, string>,
  existingBlocks: AiBatch3ExistingBlock[],
): AiBatch3DeploymentPlan {
  const existingByNode = new Map<string, AiBatch3ExistingBlock[]>();
  for (const b of existingBlocks) {
    const list = existingByNode.get(b.nodeId) ?? [];
    list.push(b);
    existingByNode.set(b.nodeId, list);
  }

  const conflicts: AiBatch3DeploymentConflict[] = [];
  const toInsert: AiBatch3PlannedBlock[] = [];
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

    const existingByOrder = new Map<number, AiBatch3ExistingBlock[]>();
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

export interface AiBatch3NodeSummary {
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
export function summarizeAiBatch3(
  lessons: PilotLesson[],
  mapping: Map<string, string>,
  existingBlocks: AiBatch3ExistingBlock[],
): AiBatch3NodeSummary[] {
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
