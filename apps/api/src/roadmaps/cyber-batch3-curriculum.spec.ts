import {
  assembleCyberBatch3Lessons,
  validateCyberBatch3Lessons,
  findDuplicatePositions,
  findDuplicateCyberBatch3Entries,
  resolveCyberBatch3Nodes,
  computeCyberBatch3DeploymentPlan,
  CYBER_BATCH3_NODES,
  CYBER_ROADMAP_SLUG,
  EXPECTED_CYBER_BATCH3_BLOCKS,
  CyberBatch3ProductionNode,
  CyberBatch3ExistingBlock,
} from '../../scripts/cyber-batch3-curriculum';

function mockProductionNodes(): CyberBatch3ProductionNode[] {
  // Different IDs than the source manifest, same semantic identity.
  return CYBER_BATCH3_NODES.map((n, i) => ({
    id: `prod-${i}`,
    title: n.exactTitle,
    roadmapSlug: n.roadmapSlug,
    stage: n.stage,
    order: n.order,
  }));
}

describe('cyber batch 3 assembly', () => {
  const lessons = assembleCyberBatch3Lessons();

  it('assembles exactly the expected total block count (78)', () => {
    const total = lessons.reduce((a, l) => a + l.blocks.length, 0);
    expect(total).toBe(EXPECTED_CYBER_BATCH3_BLOCKS);
    expect(total).toBe(78);
  });

  it('assembles exactly 4 lessons in roadmap order', () => {
    expect(lessons.length).toBe(4);
    expect(lessons.map((l) => l.nodeTitle)).toEqual([
      'Penetration Testing',
      'Malware Analysis',
      'SOC Operations',
      'Incident Response',
    ]);
  });

  it('has exact per-node counts of 20 / 17 / 20 / 21', () => {
    const byTitle = new Map(lessons.map((l) => [l.nodeTitle, l.blocks.length]));
    expect(byTitle.get('Penetration Testing')).toBe(20);
    expect(byTitle.get('Malware Analysis')).toBe(17);
    expect(byTitle.get('SOC Operations')).toBe(20);
    expect(byTitle.get('Incident Response')).toBe(21);
  });

  it('covers exactly the 4 manifest nodes by source identity', () => {
    const lessonNodeIds = new Set(lessons.map((l) => l.nodeId));
    expect(lessonNodeIds.size).toBe(4);
    for (const n of CYBER_BATCH3_NODES) {
      expect(lessonNodeIds.has(n.sourceNodeId)).toBe(true);
    }
  });

  it('keeps lesson data keyed by sourceNodeId (does not mutate to production IDs)', () => {
    for (const l of lessons) {
      const manifestEntry = CYBER_BATCH3_NODES.find(
        (n) => n.sourceNodeId === l.nodeId,
      );
      expect(manifestEntry).toBeDefined();
    }
  });

  it('validates cleanly', () => {
    expect(validateCyberBatch3Lessons(lessons)).toEqual([]);
  });

  it('has no duplicate nodeId + position', () => {
    expect(findDuplicatePositions(lessons)).toEqual([]);
  });
});

describe('cyber batch 3 semantic manifest', () => {
  it('has no duplicate roadmapSlug + exactTitle entries', () => {
    expect(findDuplicateCyberBatch3Entries(CYBER_BATCH3_NODES)).toEqual([]);
  });

  it('has exactly 4 cybersecurity targets and expected stage/order', () => {
    expect(CYBER_BATCH3_NODES.length).toBe(4);
    for (const n of CYBER_BATCH3_NODES) {
      expect(n.roadmapSlug).toBe(CYBER_ROADMAP_SLUG);
      expect(typeof n.stage).toBe('string');
      expect(typeof n.order).toBe('number');
    }
  });
});

describe('resolveCyberBatch3Nodes', () => {
  it('resolves all 4 nodes by semantic identity with different production IDs', () => {
    const { mapping, errors } = resolveCyberBatch3Nodes(
      CYBER_BATCH3_NODES,
      mockProductionNodes(),
    );
    expect(errors).toEqual([]);
    expect(mapping.size).toBe(4);
    expect(mapping.get(CYBER_BATCH3_NODES[0].sourceNodeId)).toBe('prod-0');
    expect(mapping.get(CYBER_BATCH3_NODES[3].sourceNodeId)).toBe('prod-3');
  });

  it('reports an error when a production node is missing', () => {
    const nodes = mockProductionNodes().filter((n) => n.id !== 'prod-0');
    const { errors } = resolveCyberBatch3Nodes(CYBER_BATCH3_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('no production node');
  });

  it('reports an ambiguity error when two production nodes share a title', () => {
    const nodes = mockProductionNodes();
    nodes.push({ ...nodes[0], id: 'prod-dup' });
    const { errors } = resolveCyberBatch3Nodes(CYBER_BATCH3_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('ambiguous');
  });

  it('reports an error on a wrong roadmap (title found under another slug)', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0'
        ? { ...n, roadmapSlug: 'software-engineering' as const }
        : n,
    );
    const { errors } = resolveCyberBatch3Nodes(CYBER_BATCH3_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('no production node');
  });

  it('reports an error on a wrong title', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0' ? { ...n, title: 'Pen Testing' } : n,
    );
    const { errors } = resolveCyberBatch3Nodes(CYBER_BATCH3_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('no production node');
  });

  it('reports an error on a stage mismatch', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0' ? { ...n, stage: 'WRONG' } : n,
    );
    const { errors } = resolveCyberBatch3Nodes(CYBER_BATCH3_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('stage mismatch');
  });

  it('reports an error on an order mismatch', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0' ? { ...n, order: 99 } : n,
    );
    const { errors } = resolveCyberBatch3Nodes(CYBER_BATCH3_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('order mismatch');
  });

  it('does not mutate the source manifest', () => {
    const before = JSON.stringify(CYBER_BATCH3_NODES);
    resolveCyberBatch3Nodes(CYBER_BATCH3_NODES, mockProductionNodes());
    expect(JSON.stringify(CYBER_BATCH3_NODES)).toBe(before);
  });
});

describe('computeCyberBatch3DeploymentPlan', () => {
  const lessons = assembleCyberBatch3Lessons();

  function mockMapping(): Map<string, string> {
    const m = new Map<string, string>();
    CYBER_BATCH3_NODES.forEach((n, i) => m.set(n.sourceNodeId, `prod-${i}`));
    return m;
  }

  function mockExistingAll(): CyberBatch3ExistingBlock[] {
    const mapping = mockMapping();
    const blocks: CyberBatch3ExistingBlock[] = [];
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

  it('empty production -> 78 inserts, zero conflicts', () => {
    const plan = computeCyberBatch3DeploymentPlan(lessons, mockMapping(), []);
    expect(plan.conflicts).toEqual([]);
    expect(plan.existing).toBe(0);
    expect(plan.toInsert.length).toBe(EXPECTED_CYBER_BATCH3_BLOCKS);
    expect(plan.toInsert.length).toBe(78);
  });

  it('identical existing blocks -> 0 inserts', () => {
    const plan = computeCyberBatch3DeploymentPlan(
      lessons,
      mockMapping(),
      mockExistingAll(),
    );
    expect(plan.conflicts).toEqual([]);
    expect(plan.existing).toBe(78);
    expect(plan.toInsert.length).toBe(0);
  });

  it('mixed existing/missing blocks -> inserts only the missing ones', () => {
    const existing = mockExistingAll().filter((b) => b.order !== 0);
    const plan = computeCyberBatch3DeploymentPlan(
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
    const plan = computeCyberBatch3DeploymentPlan(
      lessons,
      mockMapping(),
      existing,
    );
    expect(plan.conflicts.length).toBe(1);
    expect(plan.conflicts[0].reason).toContain('conflicting block');
  });

  it('maps source IDs to production IDs in the insert payload (local IDs differ)', () => {
    const plan = computeCyberBatch3DeploymentPlan(lessons, mockMapping(), []);
    const prodIds = new Set(plan.toInsert.map((b) => b.nodeId));
    expect([...prodIds].every((id) => id.startsWith('prod-'))).toBe(true);
    expect([...prodIds].some((id) => id.includes('7e7175c9'))).toBe(false);
  });

  it('is idempotent: first run inserts 78, second run inserts 0', () => {
    const first = computeCyberBatch3DeploymentPlan(lessons, mockMapping(), []);
    expect(first.toInsert.length).toBe(78);

    const existingAfterFirst = first.toInsert.map((b) => ({
      nodeId: b.nodeId,
      type: b.type,
      order: b.order,
      content: b.content,
    }));
    const second = computeCyberBatch3DeploymentPlan(
      lessons,
      mockMapping(),
      existingAfterFirst,
    );
    expect(second.conflicts).toEqual([]);
    expect(second.toInsert.length).toBe(0);
  });

  it('reaches the exact final count of 78 after deployment', () => {
    const plan = computeCyberBatch3DeploymentPlan(lessons, mockMapping(), []);
    expect(plan.toInsert.length).toBe(78);
    expect(plan.existing + plan.toInsert.length).toBe(
      EXPECTED_CYBER_BATCH3_BLOCKS,
    );
  });

  it('scope lock: ignores Batch 1, Batch 2, and other-roadmap nodes', () => {
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
        id: 'batch2-prod',
        title: 'Network Security',
        roadmapSlug: 'cybersecurity',
        stage: 'INFRASTRUCTURE',
        order: 6,
      },
      {
        id: 'cs-prod',
        title: 'Programming Fundamentals',
        roadmapSlug: 'computer-science',
        stage: 'PROGRAMMING',
        order: 4,
      },
    ];
    const { mapping, errors } = resolveCyberBatch3Nodes(
      CYBER_BATCH3_NODES,
      allNodes,
    );
    expect(errors).toEqual([]);
    expect(mapping.size).toBe(4);
    expect(
      [...mapping.keys()].some(
        (k) => k === 'f7a616d6-3616-4df4-94ea-be77f6f383f0',
      ),
    ).toBe(false);

    const plan = computeCyberBatch3DeploymentPlan(lessons, mapping, [
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
    ]);
    expect(plan.conflicts).toEqual([]);
    expect(plan.existing).toBe(0);
    expect(plan.toInsert.length).toBe(78);
  });

  it('does not mutate source lesson data', () => {
    const before = JSON.stringify(lessons);
    computeCyberBatch3DeploymentPlan(lessons, mockMapping(), []);
    expect(JSON.stringify(lessons)).toBe(before);
  });
});
