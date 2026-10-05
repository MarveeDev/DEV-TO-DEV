import {
  assembleCyberBatch1Lessons,
  validateCyberBatch1Lessons,
  findDuplicatePositions,
  findDuplicateCyberEntries,
  resolveCyberNodes,
  computeCyberDeploymentPlan,
  CYBER_BATCH1_NODES,
  CYBER_ROADMAP_SLUG,
  EXPECTED_CYBER_BLOCKS,
  CyberProductionNode,
  CyberExistingBlock,
} from '../../scripts/cyber-batch1-curriculum';

function mockProductionNodes(): CyberProductionNode[] {
  // Different IDs than the source manifest, same semantic identity.
  return CYBER_BATCH1_NODES.map((n, i) => ({
    id: `prod-${i}`,
    title: n.exactTitle,
    roadmapSlug: n.roadmapSlug,
    stage: n.stage,
    order: n.order,
  }));
}

describe('cyber batch 1 assembly', () => {
  const lessons = assembleCyberBatch1Lessons();

  it('assembles exactly the expected total block count (80)', () => {
    const total = lessons.reduce((a, l) => a + l.blocks.length, 0);
    expect(total).toBe(EXPECTED_CYBER_BLOCKS);
    expect(total).toBe(80);
  });

  it('assembles exactly 5 lessons in roadmap order', () => {
    expect(lessons.length).toBe(5);
    expect(lessons.map((l) => l.nodeTitle)).toEqual([
      'Security Fundamentals',
      'OS Security',
      'Networking Basics',
      'Cryptography',
      'Identity & Access Management',
    ]);
  });

  it('covers exactly the 5 manifest nodes by source identity', () => {
    const lessonNodeIds = new Set(lessons.map((l) => l.nodeId));
    expect(lessonNodeIds.size).toBe(5);
    for (const n of CYBER_BATCH1_NODES) {
      expect(lessonNodeIds.has(n.sourceNodeId)).toBe(true);
    }
  });

  it('keeps lesson data keyed by sourceNodeId (does not mutate to production IDs)', () => {
    for (const l of lessons) {
      const manifestEntry = CYBER_BATCH1_NODES.find(
        (n) => n.sourceNodeId === l.nodeId,
      );
      expect(manifestEntry).toBeDefined();
    }
  });

  it('validates cleanly', () => {
    expect(validateCyberBatch1Lessons(lessons)).toEqual([]);
  });

  it('has no duplicate nodeId + position', () => {
    expect(findDuplicatePositions(lessons)).toEqual([]);
  });
});

describe('cyber semantic manifest', () => {
  it('has no duplicate roadmapSlug + exactTitle entries', () => {
    expect(findDuplicateCyberEntries(CYBER_BATCH1_NODES)).toEqual([]);
  });

  it('has exactly 5 cybersecurity targets and expected stage/order', () => {
    expect(CYBER_BATCH1_NODES.length).toBe(5);
    for (const n of CYBER_BATCH1_NODES) {
      expect(n.roadmapSlug).toBe(CYBER_ROADMAP_SLUG);
      expect(typeof n.stage).toBe('string');
      expect(typeof n.order).toBe('number');
    }
  });
});

describe('resolveCyberNodes', () => {
  it('resolves all 5 nodes by semantic identity with different production IDs', () => {
    const { mapping, errors } = resolveCyberNodes(
      CYBER_BATCH1_NODES,
      mockProductionNodes(),
    );
    expect(errors).toEqual([]);
    expect(mapping.size).toBe(5);
    expect(mapping.get(CYBER_BATCH1_NODES[0].sourceNodeId)).toBe('prod-0');
    expect(mapping.get(CYBER_BATCH1_NODES[4].sourceNodeId)).toBe('prod-4');
  });

  it('reports an error when a production node is missing', () => {
    const nodes = mockProductionNodes().filter((n) => n.id !== 'prod-0');
    const { errors } = resolveCyberNodes(CYBER_BATCH1_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('no production node');
  });

  it('reports an ambiguity error when two production nodes share a title', () => {
    const nodes = mockProductionNodes();
    nodes.push({ ...nodes[0], id: 'prod-dup' });
    const { errors } = resolveCyberNodes(CYBER_BATCH1_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('ambiguous');
  });

  it('reports an error on a wrong roadmap (title found under another slug)', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0'
        ? { ...n, roadmapSlug: 'software-engineering' as const }
        : n,
    );
    const { errors } = resolveCyberNodes(CYBER_BATCH1_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('no production node');
  });

  it('reports an error on a wrong title', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0' ? { ...n, title: 'Security Basics' } : n,
    );
    const { errors } = resolveCyberNodes(CYBER_BATCH1_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('no production node');
  });

  it('reports an error on a stage mismatch', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0' ? { ...n, stage: 'WRONG' } : n,
    );
    const { errors } = resolveCyberNodes(CYBER_BATCH1_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('stage mismatch');
  });

  it('reports an error on an order mismatch', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0' ? { ...n, order: 99 } : n,
    );
    const { errors } = resolveCyberNodes(CYBER_BATCH1_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('order mismatch');
  });

  it('does not mutate the source manifest', () => {
    const before = JSON.stringify(CYBER_BATCH1_NODES);
    resolveCyberNodes(CYBER_BATCH1_NODES, mockProductionNodes());
    expect(JSON.stringify(CYBER_BATCH1_NODES)).toBe(before);
  });
});

describe('computeCyberDeploymentPlan', () => {
  const lessons = assembleCyberBatch1Lessons();

  function mockMapping(): Map<string, string> {
    const m = new Map<string, string>();
    CYBER_BATCH1_NODES.forEach((n, i) => m.set(n.sourceNodeId, `prod-${i}`));
    return m;
  }

  function mockExistingAll(): CyberExistingBlock[] {
    const mapping = mockMapping();
    const blocks: CyberExistingBlock[] = [];
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

  it('empty production -> 80 inserts, zero conflicts', () => {
    const plan = computeCyberDeploymentPlan(lessons, mockMapping(), []);
    expect(plan.conflicts).toEqual([]);
    expect(plan.existing).toBe(0);
    expect(plan.toInsert.length).toBe(EXPECTED_CYBER_BLOCKS);
    expect(plan.toInsert.length).toBe(80);
  });

  it('identical existing blocks -> 0 inserts', () => {
    const plan = computeCyberDeploymentPlan(
      lessons,
      mockMapping(),
      mockExistingAll(),
    );
    expect(plan.conflicts).toEqual([]);
    expect(plan.existing).toBe(80);
    expect(plan.toInsert.length).toBe(0);
  });

  it('mixed existing/missing blocks -> inserts only the missing ones', () => {
    const existing = mockExistingAll().filter((b) => b.order !== 0);
    const plan = computeCyberDeploymentPlan(lessons, mockMapping(), existing);
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
    const plan = computeCyberDeploymentPlan(lessons, mockMapping(), existing);
    expect(plan.conflicts.length).toBe(1);
    expect(plan.conflicts[0].reason).toContain('conflicting block');
  });

  it('maps source IDs to production IDs in the insert payload (local IDs differ)', () => {
    const plan = computeCyberDeploymentPlan(lessons, mockMapping(), []);
    const prodIds = new Set(plan.toInsert.map((b) => b.nodeId));
    expect([...prodIds].every((id) => id.startsWith('prod-'))).toBe(true);
    expect([...prodIds].some((id) => id.includes('f7a616d6'))).toBe(false);
  });

  it('is idempotent: first run inserts 80, second run inserts 0', () => {
    const first = computeCyberDeploymentPlan(lessons, mockMapping(), []);
    expect(first.toInsert.length).toBe(80);

    const existingAfterFirst = first.toInsert.map((b) => ({
      nodeId: b.nodeId,
      type: b.type,
      order: b.order,
      content: b.content,
    }));
    const second = computeCyberDeploymentPlan(
      lessons,
      mockMapping(),
      existingAfterFirst,
    );
    expect(second.conflicts).toEqual([]);
    expect(second.toInsert.length).toBe(0);
  });

  it('reaches the exact final count of 80 after deployment', () => {
    const plan = computeCyberDeploymentPlan(lessons, mockMapping(), []);
    expect(plan.toInsert.length).toBe(80);
    // existing + toInsert equals the intended total.
    expect(plan.existing + plan.toInsert.length).toBe(EXPECTED_CYBER_BLOCKS);
  });

  it('does not mutate source lesson data', () => {
    const before = JSON.stringify(lessons);
    computeCyberDeploymentPlan(lessons, mockMapping(), []);
    expect(JSON.stringify(lessons)).toBe(before);
  });
});
