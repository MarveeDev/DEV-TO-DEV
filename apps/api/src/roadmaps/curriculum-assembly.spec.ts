import {
  assembleCurriculumLessons,
  validateAssembledLessons,
  findDuplicatePositions,
  findDuplicateSemanticEntries,
  resolveSemanticNodes,
  normalizeJson,
  CURRICULUM_NODES,
  ProductionNode,
  EXPECTED_CS_BLOCKS,
  EXPECTED_SE_BLOCKS,
  EXPECTED_TOTAL_BLOCKS,
} from '../../scripts/curriculum';

function mockProductionNodes(): ProductionNode[] {
  // Different IDs than the source manifest, same semantic identity.
  return CURRICULUM_NODES.map((n, i) => ({
    id: `prod-${i}`,
    title: n.exactTitle,
    roadmapSlug: n.roadmapSlug,
    stage: n.stage,
    order: n.order,
  }));
}

describe('curriculum assembly', () => {
  const lessons = assembleCurriculumLessons();
  const slugByNode = new Map(
    CURRICULUM_NODES.map((n) => [n.sourceNodeId, n.roadmapSlug]),
  );

  it('assembles exactly the expected total block count', () => {
    const total = lessons.reduce((a, l) => a + l.blocks.length, 0);
    expect(total).toBe(EXPECTED_TOTAL_BLOCKS);
    expect(total).toBe(471);
  });

  it('has the expected Computer Science and Software Engineering block counts', () => {
    let cs = 0;
    let se = 0;
    for (const l of lessons) {
      const slug = slugByNode.get(l.nodeId);
      if (slug === 'computer-science') cs += l.blocks.length;
      else if (slug === 'software-engineering') se += l.blocks.length;
    }
    expect(cs).toBe(EXPECTED_CS_BLOCKS);
    expect(cs).toBe(200);
    expect(se).toBe(EXPECTED_SE_BLOCKS);
    expect(se).toBe(271);
  });

  it('covers exactly the 30 manifest nodes by source identity', () => {
    expect(CURRICULUM_NODES.length).toBe(30);
    const lessonNodeIds = new Set(lessons.map((l) => l.nodeId));
    expect(lessonNodeIds.size).toBe(30);
    for (const n of CURRICULUM_NODES) {
      expect(lessonNodeIds.has(n.sourceNodeId)).toBe(true);
    }
  });

  it('keeps lesson data keyed by sourceNodeId (does not mutate to production IDs)', () => {
    for (const l of lessons) {
      const manifestEntry = CURRICULUM_NODES.find(
        (n) => n.sourceNodeId === l.nodeId,
      );
      expect(manifestEntry).toBeDefined();
    }
  });

  it('merges enrichment SECTION blocks into the pilot lessons', () => {
    const pf = lessons.find(
      (l) => l.nodeId === 'dad87655-2c48-4ac3-99ee-8b82d093d4d6',
    );
    expect(pf).toBeDefined();
    expect(pf!.blocks.some((b) => b.type === 'SECTION')).toBe(true);
    expect(pf!.blocks[0].type).toBe('EXPLANATION');
    expect(pf!.blocks[1].type).toBe('SECTION');
  });

  it('validates cleanly', () => {
    expect(validateAssembledLessons(lessons)).toEqual([]);
  });

  it('has no duplicate nodeId + position', () => {
    expect(findDuplicatePositions(lessons)).toEqual([]);
  });

  it('is deterministic across assemblies', () => {
    const again = assembleCurriculumLessons();
    expect(JSON.stringify(again)).toBe(JSON.stringify(lessons));
  });

  it('normalizes JSON deterministically (key order ignored, array order preserved)', () => {
    expect(normalizeJson({ a: 1, b: 2 })).toBe(normalizeJson({ b: 2, a: 1 }));
    expect(normalizeJson([1, 2])).not.toBe(normalizeJson([2, 1]));
    expect(normalizeJson({ nested: { x: 1, y: 2 } })).toBe(
      normalizeJson({ nested: { y: 2, x: 1 } }),
    );
  });
});

describe('semantic manifest', () => {
  it('has no duplicate roadmapSlug + exactTitle entries', () => {
    expect(findDuplicateSemanticEntries(CURRICULUM_NODES)).toEqual([]);
  });

  it('has exactly 15 Computer Science and 15 Software Engineering targets', () => {
    const cs = CURRICULUM_NODES.filter(
      (n) => n.roadmapSlug === 'computer-science',
    );
    const se = CURRICULUM_NODES.filter(
      (n) => n.roadmapSlug === 'software-engineering',
    );
    expect(cs.length).toBe(15);
    expect(se.length).toBe(15);
  });
});

describe('resolveSemanticNodes', () => {
  it('resolves all 30 nodes by semantic identity with different production IDs', () => {
    const { mapping, errors } = resolveSemanticNodes(
      CURRICULUM_NODES,
      mockProductionNodes(),
    );
    expect(errors).toEqual([]);
    expect(mapping.size).toBe(30);
    // Source IDs map to distinct production IDs.
    expect(mapping.get(CURRICULUM_NODES[0].sourceNodeId)).toBe('prod-0');
    expect(mapping.get(CURRICULUM_NODES[15].sourceNodeId)).toBe('prod-15');
  });

  it('reports an error when a production node is missing', () => {
    const nodes = mockProductionNodes().filter((n) => n.id !== 'prod-0');
    const { errors } = resolveSemanticNodes(CURRICULUM_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('no production node');
  });

  it('reports an ambiguity error when two production nodes share a title', () => {
    const nodes = mockProductionNodes();
    nodes.push({ ...nodes[0], id: 'prod-dup' });
    const { errors } = resolveSemanticNodes(CURRICULUM_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('ambiguous');
  });

  it('reports an error on a wrong roadmap (title found under another slug)', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0' ? { ...n, roadmapSlug: 'other-roadmap' as const } : n,
    );
    const { errors } = resolveSemanticNodes(CURRICULUM_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('no production node');
  });

  it('reports an error on a stage mismatch', () => {
    const nodes = mockProductionNodes().map((n) =>
      n.id === 'prod-0' ? { ...n, stage: 'WRONG' } : n,
    );
    const { errors } = resolveSemanticNodes(CURRICULUM_NODES, nodes);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('stage mismatch');
  });

  it('does not mutate the source manifest', () => {
    const before = JSON.stringify(CURRICULUM_NODES);
    resolveSemanticNodes(CURRICULUM_NODES, mockProductionNodes());
    expect(JSON.stringify(CURRICULUM_NODES)).toBe(before);
  });
});
