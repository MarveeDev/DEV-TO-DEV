import {
  assembleAiBatch3Lessons,
  validateAiBatch3Lessons,
  findDuplicatePositions,
  findDuplicateAiBatch3Entries,
  resolveAiBatch3Nodes,
  computeAiBatch3DeploymentPlan,
  AI_BATCH3_NODES,
  AI_ROADMAP_SLUG,
  EXPECTED_AI_BATCH3_BLOCKS,
  AiBatch3ProductionNode,
  AiBatch3ExistingBlock,
} from '../../scripts/ai-batch3-curriculum';

function mockProductionNodes(): AiBatch3ProductionNode[] {
  // Different IDs than the source manifest, same semantic identity.
  return AI_BATCH3_NODES.map((n, i) => ({
    id: `prod-${i}`,
    title: n.exactTitle,
    roadmapSlug: n.roadmapSlug,
    stage: n.stage,
    order: n.order,
  }));
}

describe('ai batch 3 assembly', () => {
  const lessons = assembleAiBatch3Lessons();

  it('assembles exactly the expected total block count (119)', () => {
    const total = lessons.reduce((a, l) => a + l.blocks.length, 0);
    expect(total).toBe(EXPECTED_AI_BATCH3_BLOCKS);
    expect(total).toBe(119);
  });

  it('assembles exactly 5 lessons in roadmap order', () => {
    expect(lessons.length).toBe(5);
    expect(lessons.map((l) => l.nodeTitle)).toEqual([
      'Deep Learning Basics',
      'Computer Vision',
      'Natural Language Processing',
      'Generative AI & LLMs',
      'MLOps',
    ]);
  });

  it('has exact per-node counts of 23 / 21 / 24 / 29 / 22', () => {
    const byTitle = new Map(lessons.map((l) => [l.nodeTitle, l.blocks.length]));
    expect(byTitle.get('Deep Learning Basics')).toBe(23);
    expect(byTitle.get('Computer Vision')).toBe(21);
    expect(byTitle.get('Natural Language Processing')).toBe(24);
    expect(byTitle.get('Generative AI & LLMs')).toBe(29);
    expect(byTitle.get('MLOps')).toBe(22);
  });

  it('has contiguous positions per node (0..n-1, no duplicates)', () => {
    for (const lesson of lessons) {
      const orders = lesson.blocks.map((_, i) => i);
      expect(orders[0]).toBe(0);
      expect(orders[orders.length - 1]).toBe(lesson.blocks.length - 1);
    }
    expect(findDuplicatePositions(lessons)).toEqual([]);
  });

  it('covers exactly the 5 manifest nodes by source identity', () => {
    const lessonNodeIds = new Set(lessons.map((l) => l.nodeId));
    expect(lessonNodeIds.size).toBe(5);
    for (const n of AI_BATCH3_NODES) {
      expect(lessonNodeIds.has(n.sourceNodeId)).toBe(true);
    }
  });

  it('keeps lesson data keyed by sourceNodeId (does not mutate to production IDs)', () => {
    for (const l of lessons) {
      const manifestEntry = AI_BATCH3_NODES.find(
        (n) => n.sourceNodeId === l.nodeId,
      );
      expect(manifestEntry).toBeDefined();
    }
  });

  it('validates cleanly', () => {
    expect(validateAiBatch3Lessons(lessons)).toEqual([]);
  });
});

describe('ai batch 3 semantic manifest', () => {
  it('has no duplicate roadmapSlug + exactTitle entries', () => {
    expect(findDuplicateAiBatch3Entries(AI_BATCH3_NODES)).toEqual([]);
  });

  it('has exactly 5 ai-machine-learning targets with expected orders', () => {
    expect(AI_BATCH3_NODES.length).toBe(5);
    for (const n of AI_BATCH3_NODES) {
      expect(n.roadmapSlug).toBe(AI_ROADMAP_SLUG);
      expect(typeof n.stage).toBe('string');
      expect(typeof n.order).toBe('number');
    }
    expect(AI_BATCH3_NODES.map((n) => n.order)).toEqual([8, 9, 10, 11, 12]);
  });

  it('protects against unexpected target expansion (no node beyond order 12)', () => {
    expect(Math.max(...AI_BATCH3_NODES.map((n) => n.order))).toBe(12);
    expect(AI_BATCH3_NODES.some((n) => n.order < 8)).toBe(false);
  });
});

describe('resolveAiBatch3Nodes', () => {
  it('resolves all 5 nodes by semantic identity with different production IDs', () => {
    const { mapping, errors } = resolveAiBatch3Nodes(
      AI_BATCH3_NODES,
      mockProductionNodes(),
    );
    expect(errors).toEqual([]);
    expect(mapping.size).toBe(5);
    expect(mapping.get(AI_BATCH3_NODES[0].sourceNodeId)).toBe('prod-0');
    expect(mapping.get(AI_BATCH3_NODES[4].sourceNodeId)).toBe('prod-4');
  });

  it('reports an error when a production node is missing', () => {
    const nodes = mockProductionNodes().filter((n) => n.id !== 'prod-0');
    const { errors } = resolveAiBatch3Nodes(AI_BATCH3_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('no production node');
  });

  it('reports an ambiguity error when two production nodes share a title', () => {
    const nodes = mockProductionNodes();
    nodes.push({ ...nodes[0], id: 'prod-dup' });
    const { errors } = resolveAiBatch3Nodes(AI_BATCH3_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('ambiguous');
  });

  it('reports an error on a wrong roadmap (title found under another slug)', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0'
        ? { ...n, roadmapSlug: 'software-engineering' as const }
        : n,
    );
    const { errors } = resolveAiBatch3Nodes(AI_BATCH3_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('no production node');
  });

  it('reports an error on a wrong title', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0' ? { ...n, title: 'Deep Learning' } : n,
    );
    const { errors } = resolveAiBatch3Nodes(AI_BATCH3_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('no production node');
  });

  it('reports an error on a stage mismatch', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0' ? { ...n, stage: 'WRONG' } : n,
    );
    const { errors } = resolveAiBatch3Nodes(AI_BATCH3_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('stage mismatch');
  });

  it('reports an error on an order mismatch', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0' ? { ...n, order: 99 } : n,
    );
    const { errors } = resolveAiBatch3Nodes(AI_BATCH3_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('order mismatch');
  });

  it('does not mutate the source manifest', () => {
    const before = JSON.stringify(AI_BATCH3_NODES);
    resolveAiBatch3Nodes(AI_BATCH3_NODES, mockProductionNodes());
    expect(JSON.stringify(AI_BATCH3_NODES)).toBe(before);
  });
});

describe('computeAiBatch3DeploymentPlan', () => {
  const lessons = assembleAiBatch3Lessons();

  function mockMapping(): Map<string, string> {
    const m = new Map<string, string>();
    AI_BATCH3_NODES.forEach((n, i) => m.set(n.sourceNodeId, `prod-${i}`));
    return m;
  }

  function mockExistingAll(): AiBatch3ExistingBlock[] {
    const mapping = mockMapping();
    const blocks: AiBatch3ExistingBlock[] = [];
    for (const lesson of lessons) {
      const prodId = mapping.get(lesson.nodeId)!;
      lesson.blocks.forEach((b, i) => {
        blocks.push({
          nodeId: prodId,
          type: b.type,
          order: i,
          content: b.content,
        });
      });
    }
    return blocks;
  }

  it('empty production -> 119 inserts, zero conflicts', () => {
    const plan = computeAiBatch3DeploymentPlan(lessons, mockMapping(), []);
    expect(plan.conflicts).toEqual([]);
    expect(plan.existing).toBe(0);
    expect(plan.toInsert.length).toBe(EXPECTED_AI_BATCH3_BLOCKS);
    expect(plan.toInsert.length).toBe(119);
  });

  it('identical existing blocks -> 0 inserts', () => {
    const plan = computeAiBatch3DeploymentPlan(
      lessons,
      mockMapping(),
      mockExistingAll(),
    );
    expect(plan.conflicts).toEqual([]);
    expect(plan.existing).toBe(119);
    expect(plan.toInsert.length).toBe(0);
  });

  it('mixed existing/missing blocks -> inserts only the missing ones', () => {
    const existing = mockExistingAll().filter((b) => b.order !== 0);
    const plan = computeAiBatch3DeploymentPlan(
      lessons,
      mockMapping(),
      existing,
    );
    expect(plan.conflicts).toEqual([]);
    // Each of the 5 lessons is missing its position-0 block.
    expect(plan.toInsert.length).toBe(5);
  });

  it('conflicting existing block -> abort (reports conflict)', () => {
    const existing = mockExistingAll().map((b) =>
      b.order === 0 && b.nodeId === 'prod-0'
        ? { ...b, type: 'WRONG' as const }
        : b,
    );
    const plan = computeAiBatch3DeploymentPlan(
      lessons,
      mockMapping(),
      existing,
    );
    expect(plan.conflicts.length).toBe(1);
    expect(plan.conflicts[0].reason).toContain('conflicting block');
  });

  it('maps source IDs to production IDs in the insert payload (local IDs differ)', () => {
    const plan = computeAiBatch3DeploymentPlan(lessons, mockMapping(), []);
    const prodIds = new Set(plan.toInsert.map((b) => b.nodeId));
    expect([...prodIds].every((id) => id.startsWith('prod-'))).toBe(true);
    expect([...prodIds].some((id) => id.includes('d5932c0c'))).toBe(false);
  });

  it('is idempotent: first run inserts 119, second run inserts 0', () => {
    const first = computeAiBatch3DeploymentPlan(lessons, mockMapping(), []);
    expect(first.toInsert.length).toBe(119);

    const existingAfterFirst = first.toInsert.map((b) => ({
      nodeId: b.nodeId,
      type: b.type,
      order: b.order,
      content: b.content,
    }));
    const second = computeAiBatch3DeploymentPlan(
      lessons,
      mockMapping(),
      existingAfterFirst,
    );
    expect(second.conflicts).toEqual([]);
    expect(second.toInsert.length).toBe(0);
  });

  it('reaches the exact final count of 119 after deployment', () => {
    const plan = computeAiBatch3DeploymentPlan(lessons, mockMapping(), []);
    expect(plan.toInsert.length).toBe(119);
    expect(plan.existing + plan.toInsert.length).toBe(
      EXPECTED_AI_BATCH3_BLOCKS,
    );
  });

  it('critical safety: existing Batch 1 and Batch 2 blocks are NOT conflicts', () => {
    const mapping = mockMapping();
    const batch1Blocks: AiBatch3ExistingBlock[] = Array.from(
      { length: 61 },
      (_, i) => ({
        nodeId: 'batch1-prod',
        type: 'EXPLANATION',
        order: i,
        content: { text: `batch1-${i}` },
      }),
    );
    const batch2Blocks: AiBatch3ExistingBlock[] = Array.from(
      { length: 89 },
      (_, i) => ({
        nodeId: 'batch2-prod',
        type: 'EXPLANATION',
        order: i,
        content: { text: `batch2-${i}` },
      }),
    );
    const plan = computeAiBatch3DeploymentPlan(lessons, mapping, [
      ...batch1Blocks,
      ...batch2Blocks,
    ]);
    expect(plan.conflicts).toEqual([]);
    expect(plan.existing).toBe(0);
    expect(plan.toInsert.length).toBe(119);
  });

  it('scope lock: ignores Batch 1, Batch 2, and other-roadmap nodes', () => {
    const allNodes = [
      ...mockProductionNodes(),
      {
        id: 'batch1-prod',
        title: 'Math for ML',
        roadmapSlug: 'ai-machine-learning',
        stage: 'FOUNDATIONS',
        order: 2,
      },
      {
        id: 'batch2-prod',
        title: 'Supervised Learning',
        roadmapSlug: 'ai-machine-learning',
        stage: 'MACHINE LEARNING',
        order: 5,
      },
      {
        id: 'cyber-prod',
        title: 'Security Fundamentals',
        roadmapSlug: 'cybersecurity',
        stage: 'FOUNDATIONS',
        order: 1,
      },
    ];
    const { mapping, errors } = resolveAiBatch3Nodes(AI_BATCH3_NODES, allNodes);
    expect(errors).toEqual([]);
    expect(mapping.size).toBe(5);

    const plan = computeAiBatch3DeploymentPlan(lessons, mapping, [
      {
        nodeId: 'batch1-prod',
        type: 'EXPLANATION',
        order: 0,
        content: { text: 'x' },
      },
      {
        nodeId: 'batch2-prod',
        type: 'EXPLANATION',
        order: 0,
        content: { text: 'x' },
      },
      {
        nodeId: 'cyber-prod',
        type: 'EXPLANATION',
        order: 0,
        content: { text: 'x' },
      },
    ]);
    expect(plan.conflicts).toEqual([]);
    expect(plan.existing).toBe(0);
    expect(plan.toInsert.length).toBe(119);
  });

  it('does not mutate source lesson data', () => {
    const before = JSON.stringify(lessons);
    computeAiBatch3DeploymentPlan(lessons, mockMapping(), []);
    expect(JSON.stringify(lessons)).toBe(before);
  });
});
