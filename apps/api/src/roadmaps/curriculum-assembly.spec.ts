import {
  assembleCurriculumLessons,
  validateAssembledLessons,
  findDuplicatePositions,
  normalizeJson,
  CURRICULUM_NODES,
  EXPECTED_CS_BLOCKS,
  EXPECTED_SE_BLOCKS,
  EXPECTED_TOTAL_BLOCKS,
} from '../../scripts/curriculum';

describe('curriculum assembly', () => {
  const lessons = assembleCurriculumLessons();
  const slugByNode = new Map(
    CURRICULUM_NODES.map((n) => [n.nodeId, n.roadmapSlug]),
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

  it('covers exactly the 30 manifest nodes', () => {
    expect(CURRICULUM_NODES.length).toBe(30);
    const lessonNodeIds = new Set(lessons.map((l) => l.nodeId));
    expect(lessonNodeIds.size).toBe(30);
    for (const n of CURRICULUM_NODES) {
      expect(lessonNodeIds.has(n.nodeId)).toBe(true);
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
