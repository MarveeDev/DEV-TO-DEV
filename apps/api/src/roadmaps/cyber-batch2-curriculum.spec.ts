import {
  assembleCyberBatch2Lessons,
  validateCyberBatch2Lessons,
  findDuplicatePositions,
  findDuplicateCyberBatch2Entries,
  resolveCyberBatch2Nodes,
  computeCyberBatch2DeploymentPlan,
  CYBER_BATCH2_NODES,
  CYBER_ROADMAP_SLUG,
  EXPECTED_CYBER_BATCH2_BLOCKS,
  CyberBatch2ProductionNode,
  CyberBatch2ExistingBlock,
} from '../../scripts/cyber-batch2-curriculum';

function mockProductionNodes(): CyberBatch2ProductionNode[] {
  // Different IDs than the source manifest, same semantic identity.
  return CYBER_BATCH2_NODES.map((n, i) => ({
    id: `prod-${i}`,
    title: n.exactTitle,
    roadmapSlug: n.roadmapSlug,
    stage: n.stage,
    order: n.order,
  }));
}

describe('cyber batch 2 assembly', () => {
  const lessons = assembleCyberBatch2Lessons();

  it('assembles exactly the expected total block count (85)', () => {
    const total = lessons.reduce((a, l) => a + l.blocks.length, 0);
    expect(total).toBe(EXPECTED_CYBER_BATCH2_BLOCKS);
    expect(total).toBe(85);
  });

  it('assembles exactly 4 lessons in roadmap order', () => {
    expect(lessons.length).toBe(4);
    expect(lessons.map((l) => l.nodeTitle)).toEqual([
      'Network Security',
      'Cloud Security',
      'Web Application Security',
      'Secure Coding & SAST',
    ]);
  });

  it('has exact per-node counts of 22 / 19 / 23 / 21', () => {
    const byTitle = new Map(lessons.map((l) => [l.nodeTitle, l.blocks.length]));
    expect(byTitle.get('Network Security')).toBe(22);
    expect(byTitle.get('Cloud Security')).toBe(19);
    expect(byTitle.get('Web Application Security')).toBe(23);
    expect(byTitle.get('Secure Coding & SAST')).toBe(21);
  });

  it('covers exactly the 4 manifest nodes by source identity', () => {
    const lessonNodeIds = new Set(lessons.map((l) => l.nodeId));
    expect(lessonNodeIds.size).toBe(4);
    for (const n of CYBER_BATCH2_NODES) {
      expect(lessonNodeIds.has(n.sourceNodeId)).toBe(true);
    }
  });

  it('keeps lesson data keyed by sourceNodeId (does not mutate to production IDs)', () => {
    for (const l of lessons) {
      const manifestEntry = CYBER_BATCH2_NODES.find(
        (n) => n.sourceNodeId === l.nodeId,
      );
      expect(manifestEntry).toBeDefined();
    }
  });

  it('validates cleanly', () => {
    expect(validateCyberBatch2Lessons(lessons)).toEqual([]);
  });

  it('has no duplicate nodeId + position', () => {
    expect(findDuplicatePositions(lessons)).toEqual([]);
  });
});

describe('cyber batch 2 semantic manifest', () => {
  it('has no duplicate roadmapSlug + exactTitle entries', () => {
    expect(findDuplicateCyberBatch2Entries(CYBER_BATCH2_NODES)).toEqual([]);
  });

  it('has exactly 4 cybersecurity targets and expected stage/order', () => {
    expect(CYBER_BATCH2_NODES.length).toBe(4);
    for (const n of CYBER_BATCH2_NODES) {
      expect(n.roadmapSlug).toBe(CYBER_ROADMAP_SLUG);
      expect(typeof n.stage).toBe('string');
      expect(typeof n.order).toBe('number');
    }
  });
});

describe('resolveCyberBatch2Nodes', () => {
  it('resolves all 4 nodes by semantic identity with different production IDs', () => {
    const { mapping, errors } = resolveCyberBatch2Nodes(
      CYBER_BATCH2_NODES,
      mockProductionNodes(),
    );
    expect(errors).toEqual([]);
    expect(mapping.size).toBe(4);
    expect(mapping.get(CYBER_BATCH2_NODES[0].sourceNodeId)).toBe('prod-0');
    expect(mapping.get(CYBER_BATCH2_NODES[3].sourceNodeId)).toBe('prod-3');
  });

  it('reports an error when a production node is missing', () => {
    const nodes = mockProductionNodes().filter((n) => n.id !== 'prod-0');
    const { errors } = resolveCyberBatch2Nodes(CYBER_BATCH2_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('no production node');
  });

  it('reports an ambiguity error when two production nodes share a title', () => {
    const nodes = mockProductionNodes();
    nodes.push({ ...nodes[0], id: 'prod-dup' });
    const { errors } = resolveCyberBatch2Nodes(CYBER_BATCH2_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('ambiguous');
  });

  it('reports an error on a wrong roadmap (title found under another slug)', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0'
        ? { ...n, roadmapSlug: 'software-engineering' as const }
        : n,
    );
    const { errors } = resolveCyberBatch2Nodes(CYBER_BATCH2_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('no production node');
  });

  it('reports an error on a wrong title', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0' ? { ...n, title: 'Network Security Basics' } : n,
    );
    const { errors } = resolveCyberBatch2Nodes(CYBER_BATCH2_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('no production node');
  });

  it('reports an error on a stage mismatch', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0' ? { ...n, stage: 'WRONG' } : n,
    );
    const { errors } = resolveCyberBatch2Nodes(CYBER_BATCH2_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('stage mismatch');
  });

  it('reports an error on an order mismatch', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0' ? { ...n, order: 99 } : n,
    );
    const { errors } = resolveCyberBatch2Nodes(CYBER_BATCH2_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('order mismatch');
  });

  it('does not mutate the source manifest', () => {
    const before = JSON.stringify(CYBER_BATCH2_NODES);
    resolveCyberBatch2Nodes(CYBER_BATCH2_NODES, mockProductionNodes());
    expect(JSON.stringify(CYBER_BATCH2_NODES)).toBe(before);
  });
});

describe('computeCyberBatch2DeploymentPlan', () => {
  const lessons = assembleCyberBatch2Lessons();

  function mockMapping(): Map<string, string> {
    const m = new Map<string, string>();
    CYBER_BATCH2_NODES.forEach((n, i) => m.set(n.sourceNodeId, `prod-${i}`));
    return m;
  }

  function mockExistingAll(): CyberBatch2ExistingBlock[] {
    const mapping = mockMapping();
    const blocks: CyberBatch2ExistingBlock[] = [];
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

  it('empty production -> 85 inserts, zero conflicts', () => {
    const plan = computeCyberBatch2DeploymentPlan(lessons, mockMapping(), []);
    expect(plan.conflicts).toEqual([]);
    expect(plan.existing).toBe(0);
    expect(plan.toInsert.length).toBe(EXPECTED_CYBER_BATCH2_BLOCKS);
    expect(plan.toInsert.length).toBe(85);
  });

  it('identical existing blocks -> 0 inserts', () => {
    const plan = computeCyberBatch2DeploymentPlan(
      lessons,
      mockMapping(),
      mockExistingAll(),
    );
    expect(plan.conflicts).toEqual([]);
    expect(plan.existing).toBe(85);
    expect(plan.toInsert.length).toBe(0);
  });

  it('mixed existing/missing blocks -> inserts only the missing ones', () => {
    const existing = mockExistingAll().filter((b) => b.order !== 0);
    const plan = computeCyberBatch2DeploymentPlan(
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
    const plan = computeCyberBatch2DeploymentPlan(
      lessons,
      mockMapping(),
      existing,
    );
    expect(plan.conflicts.length).toBe(1);
    expect(plan.conflicts[0].reason).toContain('conflicting block');
  });

  it('maps source IDs to production IDs in the insert payload (local IDs differ)', () => {
    const plan = computeCyberBatch2DeploymentPlan(lessons, mockMapping(), []);
    const prodIds = new Set(plan.toInsert.map((b) => b.nodeId));
    expect([...prodIds].every((id) => id.startsWith('prod-'))).toBe(true);
    expect([...prodIds].some((id) => id.includes('d8b0a252'))).toBe(false);
  });

  it('is idempotent: first run inserts 85, second run inserts 0', () => {
    const first = computeCyberBatch2DeploymentPlan(lessons, mockMapping(), []);
    expect(first.toInsert.length).toBe(85);

    const existingAfterFirst = first.toInsert.map((b) => ({
      nodeId: b.nodeId,
      type: b.type,
      order: b.order,
      content: b.content,
    }));
    const second = computeCyberBatch2DeploymentPlan(
      lessons,
      mockMapping(),
      existingAfterFirst,
    );
    expect(second.conflicts).toEqual([]);
    expect(second.toInsert.length).toBe(0);
  });

  it('reaches the exact final count of 85 after deployment', () => {
    const plan = computeCyberBatch2DeploymentPlan(lessons, mockMapping(), []);
    expect(plan.toInsert.length).toBe(85);
    expect(plan.existing + plan.toInsert.length).toBe(
      EXPECTED_CYBER_BATCH2_BLOCKS,
    );
  });

  it('scope lock: ignores Batch 1 and other-roadmap nodes', () => {
    const allNodes = [
      ...mockProductionNodes(),
      {
        id: 'batch1-prod',
        title: 'Security Fundamentals',
        roadmapSlug: 'cybersecurity',
        stage: 'FOUNDATIONS',
        order: 1,
      },
      {
        id: 'cs-prod',
        title: 'Programming Fundamentals',
        roadmapSlug: 'computer-science',
        stage: 'PROGRAMMING',
        order: 4,
      },
    ];
    const { mapping, errors } = resolveCyberBatch2Nodes(
      CYBER_BATCH2_NODES,
      allNodes,
    );
    expect(errors).toEqual([]);
    expect(mapping.size).toBe(4);
    expect(
      [...mapping.keys()].some(
        (k) => k === 'f7a616d6-3616-4df4-94ea-be77f6f383f0',
      ),
    ).toBe(false);

    const plan = computeCyberBatch2DeploymentPlan(lessons, mapping, [
      {
        nodeId: 'batch1-prod',
        type: 'EXPLANATION',
        order: 0,
        content: { text: 'x' },
      },
    ]);
    expect(plan.conflicts).toEqual([]);
    expect(plan.existing).toBe(0);
    expect(plan.toInsert.length).toBe(85);
  });

  it('does not mutate source lesson data', () => {
    const before = JSON.stringify(lessons);
    computeCyberBatch2DeploymentPlan(lessons, mockMapping(), []);
    expect(JSON.stringify(lessons)).toBe(before);
  });
});
