const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/devtodev?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const roadmaps = await prisma.roadmap.count();
  const nodes = await prisma.roadmapNode.count();
  const skills = await prisma.skill.count();
  const nodeSkills = await prisma.roadmapNodeSkill.count();
  const prerequisites = await prisma.roadmapNodePrerequisite.count();

  console.log(`Roadmaps: ${roadmaps}`);
  console.log(`Total nodes: ${nodes}`);
  console.log(`Skills: ${skills}`);
  console.log(`RoadmapNodeSkill relationships: ${nodeSkills}`);
  console.log(`Prerequisite relationships: ${prerequisites}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
