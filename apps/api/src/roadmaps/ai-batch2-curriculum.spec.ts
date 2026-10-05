import {
  assembleAiBatch2Lessons,
  validateAiBatch2Lessons,
  findDuplicatePositions,
  findDuplicateAiBatch2Entries,
  resolveAiBatch2Nodes,
  computeAiBatch2DeploymentPlan,
  AI_BATCH2_NODES,
  AI_ROADMAP_SLUG,
  EXPECTED_AI_BATCH2_BLOCKS,
  AiBatch2ProductionNode,
  AiBatch2ExistingBlock,
} from '../../scripts/ai-batch2-curriculum';

function mockProductionNodes(): AiBatch2ProductionNode[] {
  // Different IDs than the source manifest, same semantic identity.
  return AI_BATCH2_NODES.map((n, i) => ({
    id: `prod-${i}`,
    title: n.exactTitle,
    roadmapSlug: n.roadmapSlug,
    stage: n.stage,
    order: n.order,
  }));
}

describe('ai batch 2 assembly', () => {
  const lessons = assembleAiBatch2Lessons();

  it('assembles exactly the expected total block count (89)', () => {
    const total = lessons.reduce((a, l) => a + l.blocks.length, 0);
    expect(total).toBe(EXPECTED_AI_BATCH2_BLOCKS);
    expect(total).toBe(89);
  });

  it('assembles exactly 4 lessons in roadmap order', () => {
    expect(lessons.length).toBe(4);
    expect(lessons.map((l) => l.nodeTitle)).toEqual([
      'Data Preprocessing',
      'Supervised Learning',
      'Unsupervised Learning',
      'Model Evaluation',
    ]);
  });

  it('has exact per-node counts of 23 / 24 / 19 / 23', () => {
    const byTitle = new Map(lessons.map((l) => [l.nodeTitle, l.blocks.length]));
    expect(byTitle.get('Data Preprocessing')).toBe(23);
    expect(byTitle.get('Supervised Learning')).toBe(24);
    expect(byTitle.get('Unsupervised Learning')).toBe(19);
    expect(byTitle.get('Model Evaluation')).toBe(23);
  });

  it('has contiguous positions per node (0..n-1, no duplicates)', () => {
    for (const lesson of lessons) {
      const orders = lesson.blocks.map((_, i) => i);
      expect(orders[0]).toBe(0);
      expect(orders[orders.length - 1]).toBe(lesson.blocks.length - 1);
    }
    expect(findDuplicatePositions(lessons)).toEqual([]);
  });

  it('covers exactly the 4 manifest nodes by source identity', () => {
    const lessonNodeIds = new Set(lessons.map((l) => l.nodeId));
    expect(lessonNodeIds.size).toBe(4);
    for (const n of AI_BATCH2_NODES) {
      expect(lessonNodeIds.has(n.sourceNodeId)).toBe(true);
    }
  });

  it('keeps lesson data keyed by sourceNodeId (does not mutate to production IDs)', () => {
    for (const l of lessons) {
      const manifestEntry = AI_BATCH2_NODES.find(
        (n) => n.sourceNodeId === l.nodeId,
      );
      expect(manifestEntry).toBeDefined();
    }
  });

  it('validates cleanly', () => {
    expect(validateAiBatch2Lessons(lessons)).toEqual([]);
  });
});

describe('ai batch 2 semantic manifest', () => {
  it('has no duplicate roadmapSlug + exactTitle entries', () => {
    expect(findDuplicateAiBatch2Entries(AI_BATCH2_NODES)).toEqual([]);
  });

  it('has exactly 4 ai-machine-learning targets and expected stage/order', () => {
    expect(AI_BATCH2_NODES.length).toBe(4);
    for (const n of AI_BATCH2_NODES) {
      expect(n.roadmapSlug).toBe(AI_ROADMAP_SLUG);
      expect(n.stage).toBe('MACHINE LEARNING');
      expect(typeof n.order).toBe('number');
    }
  });
});

describe('resolveAiBatch2Nodes', () => {
  it('resolves all 4 nodes by semantic identity with different production IDs', () => {
    const { mapping, errors } = resolveAiBatch2Nodes(
      AI_BATCH2_NODES,
      mockProductionNodes(),
    );
    expect(errors).toEqual([]);
    expect(mapping.size).toBe(4);
    expect(mapping.get(AI_BATCH2_NODES[0].sourceNodeId)).toBe('prod-0');
    expect(mapping.get(AI_BATCH2_NODES[3].sourceNodeId)).toBe('prod-3');
  });

  it('reports an error when a production node is missing', () => {
    const nodes = mockProductionNodes().filter((n) => n.id !== 'prod-0');
    const { errors } = resolveAiBatch2Nodes(AI_BATCH2_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('no production node');
  });

  it('reports an ambiguity error when two production nodes share a title', () => {
    const nodes = mockProductionNodes();
    nodes.push({ ...nodes[0], id: 'prod-dup' });
    const { errors } = resolveAiBatch2Nodes(AI_BATCH2_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('ambiguous');
  });

  it('reports an error on a wrong roadmap (title found under another slug)', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0'
        ? { ...n, roadmapSlug: 'software-engineering' as const }
        : n,
    );
    const { errors } = resolveAiBatch2Nodes(AI_BATCH2_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('no production node');
  });

  it('reports an error on a wrong title', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0' ? { ...n, title: 'Data Prep' } : n,
    );
    const { errors } = resolveAiBatch2Nodes(AI_BATCH2_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('no production node');
  });

  it('reports an error on a stage mismatch', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0' ? { ...n, stage: 'WRONG' } : n,
    );
    const { errors } = resolveAiBatch2Nodes(AI_BATCH2_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('stage mismatch');
  });

  it('reports an error on an order mismatch', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0' ? { ...n, order: 99 } : n,
    );
    const { errors } = resolveAiBatch2Nodes(AI_BATCH2_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('order mismatch');
  });

  it('does not mutate the source manifest', () => {
    const before = JSON.stringify(AI_BATCH2_NODES);
    resolveAiBatch2Nodes(AI_BATCH2_NODES, mockProductionNodes());
    expect(JSON.stringify(AI_BATCH2_NODES)).toBe(before);
  });
});

describe('computeAiBatch2DeploymentPlan', () => {
  const lessons = assembleAiBatch2Lessons();

  function mockMapping(): Map<string, string> {
    const m = new Map<string, string>();
    AI_BATCH2_NODES.forEach((n, i) => m.set(n.sourceNodeId, `prod-${i}`));
    return m;
  }

  function mockExistingAll(): AiBatch2ExistingBlock[] {
    const mapping = mockMapping();
    const blocks: AiBatch2ExistingBlock[] = [];
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

  it('empty production -> 89 inserts, zero conflicts', () => {
    const plan = computeAiBatch2DeploymentPlan(lessons, mockMapping(), []);
    expect(plan.conflicts).toEqual([]);
    expect(plan.existing).toBe(0);
    expect(plan.toInsert.length).toBe(EXPECTED_AI_BATCH2_BLOCKS);
    expect(plan.toInsert.length).toBe(89);
  });

  it('identical existing blocks -> 0 inserts', () => {
    const plan = computeAiBatch2DeploymentPlan(
      lessons,
      mockMapping(),
      mockExistingAll(),
    );
    expect(plan.conflicts).toEqual([]);
    expect(plan.existing).toBe(89);
    expect(plan.toInsert.length).toBe(0);
  });

  it('mixed existing/missing blocks -> inserts only the missing ones', () => {
    const existing = mockExistingAll().filter((b) => b.order !== 0);
    const plan = computeAiBatch2DeploymentPlan(
      lessons,
      mockMapping(),
      existing,
    );
    expect(plan.conflicts).toEqual([]);
    // Each of the 4 lessons is missing its position-0 block.
    expect(plan.toInsert.length).toBe(4);
  });

  it('conflicting existing block -> abort (reports conflict)', () => {
    const existing = mockExistingAll().map((b) =>
      b.order === 0 && b.nodeId === 'prod-0'
        ? { ...b, type: 'WRONG' as const }
        : b,
    );
    const plan = computeAiBatch2DeploymentPlan(
      lessons,
      mockMapping(),
      existing,
    );
    expect(plan.conflicts.length).toBe(1);
    expect(plan.conflicts[0].reason).toContain('conflicting block');
  });

  it('maps source IDs to production IDs in the insert payload (local IDs differ)', () => {
    const plan = computeAiBatch2DeploymentPlan(lessons, mockMapping(), []);
    const prodIds = new Set(plan.toInsert.map((b) => b.nodeId));
    expect([...prodIds].every((id) => id.startsWith('prod-'))).toBe(true);
    expect([...prodIds].some((id) => id.includes('01e7794f'))).toBe(false);
  });

  it('is idempotent: first run inserts 89, second run inserts 0', () => {
    const first = computeAiBatch2DeploymentPlan(lessons, mockMapping(), []);
    expect(first.toInsert.length).toBe(89);

    const existingAfterFirst = first.toInsert.map((b) => ({
      nodeId: b.nodeId,
      type: b.type,
      order: b.order,
      content: b.content,
    }));
    const second = computeAiBatch2DeploymentPlan(
      lessons,
      mockMapping(),
      existingAfterFirst,
    );
    expect(second.conflicts).toEqual([]);
    expect(second.toInsert.length).toBe(0);
  });

  it('reaches the exact final count of 89 after deployment', () => {
    const plan = computeAiBatch2DeploymentPlan(lessons, mockMapping(), []);
    expect(plan.toInsert.length).toBe(89);
    expect(plan.existing + plan.toInsert.length).toBe(
      EXPECTED_AI_BATCH2_BLOCKS,
    );
  });

  it('scope lock: ignores other-AI and other-roadmap nodes', () => {
    const allNodes = [
      ...mockProductionNodes(),
      {
        id: 'ai-batch1-prod',
        title: 'Math for ML',
        roadmapSlug: 'ai-machine-learning',
        stage: 'FOUNDATIONS',
        order: 2,
      },
      {
        id: 'ai-batch3-prod',
        title: 'Deep Learning Basics',
        roadmapSlug: 'ai-machine-learning',
        stage: 'DEEP LEARNING',
        order: 8,
      },
      {
        id: 'cyber-prod',
        title: 'Security Fundamentals',
        roadmapSlug: 'cybersecurity',
        stage: 'FOUNDATIONS',
        order: 1,
      },
    ];
    const { mapping, errors } = resolveAiBatch2Nodes(AI_BATCH2_NODES, allNodes);
    expect(errors).toEqual([]);
    expect(mapping.size).toBe(4);

    const plan = computeAiBatch2DeploymentPlan(lessons, mapping, [
      {
        nodeId: 'ai-batch1-prod',
        type: 'EXPLANATION',
        order: 0,
        content: { text: 'x' },
      },
      {
        nodeId: 'ai-batch3-prod',
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
    expect(plan.toInsert.length).toBe(89);
  });

  it('does not mutate source lesson data', () => {
    const before = JSON.stringify(lessons);
    computeAiBatch2DeploymentPlan(lessons, mockMapping(), []);
    expect(JSON.stringify(lessons)).toBe(before);
  });
});
