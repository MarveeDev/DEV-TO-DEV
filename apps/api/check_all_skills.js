const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/devtodev?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  const nodeSkills = await prisma.roadmapNodeSkill.findMany({
    include: { skill: true }
  });

  const slugs = [...new Set(nodeSkills.map(ns => ns.skill.slug))];
  console.log(`Checking ${slugs.length} distinct skills mapped to roadmap nodes...`);

  let failures = 0;
  for (const slug of slugs) {
    const res = await fetch(`http://localhost:3001/api/v1/skills/${encodeURIComponent(slug)}`);
    if (!res.ok) {
      console.error(`❌ FAILED: ${slug} - HTTP ${res.status}`);
      failures++;
    }
  }

  if (failures === 0) {
    console.log(`✅ SUCCESS: All ${slugs.length} skills resolved successfully via API.`);
  } else {
    console.log(`❌ ${failures} skills failed to resolve.`);
    process.exit(1);
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
