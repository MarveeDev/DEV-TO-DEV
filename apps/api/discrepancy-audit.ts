import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/devtodev?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const roadmaps = await prisma.roadmap.findMany({ include: { nodes: true } });
  const nodes = await prisma.roadmapNode.findMany({
    include: { roadmap: true, skills: true, prerequisites: true }
  });

  const sourceFile = fs.readFileSync(path.join(__dirname, 'prisma/roadmaps.data.ts'), 'utf8');
  // very naive parsing, just looking for keys vs description might be better. Let's find "key: '"
  const sourceNodeCount = (sourceFile.match(/key:\s*['"]/g) || []).length;

  console.log('=== ROADMAP GROUPING ===');
  roadmaps.forEach(r => {
    console.log(`\nRoadmap: ${r.title} (${r.slug})`);
    console.log(`Node Count: ${r.nodes.length}`);
    r.nodes.forEach(n => console.log(`  - [${n.id}] ${n.title}`));
  });

  console.log('\n=== 22 ADDITIONAL NODES INVESTIGATION ===');
  const nodesMissingResources = nodes.filter(n => !n.recommendedBookTitle || !n.videoTitle);
  nodesMissingResources.forEach(n => {
    console.log(`\nNode ID: ${n.id}`);
    console.log(`Title: ${n.title}`);
    console.log(`Roadmap ID: ${n.roadmapId}`);
    console.log(`Roadmap Name: ${n.roadmap?.title || 'ORPHAN'}`);
    console.log(`Roadmap Slug: ${n.roadmap?.slug || 'ORPHAN'}`);
    console.log(`Active Roadmap: ${roadmaps.some(r => r.id === n.roadmapId)}`);
    console.log(`Has Learning Content: ${!!n.description && !!n.practicalExercise}`);
    console.log(`Has Prerequisites: ${n.prerequisites.length > 0}`);
    console.log(`Has Skills: ${n.skills.length > 0}`);
    console.log(`Has Reading Resource: ${!!n.recommendedBookTitle}`);
    console.log(`Has Video Resource: ${!!n.videoTitle}`);
  });

  console.log('\n=== VERIFICATION ===');
  console.log(`Total Roadmaps: ${roadmaps.length}`);
  const orphanNodes = nodes.filter(n => !n.roadmap);
  console.log(`Orphan Nodes: ${orphanNodes.length}`);
  
  const duplicateRoadmaps = new Set(roadmaps.map(r => r.slug)).size !== roadmaps.length;
  console.log(`Duplicate Roadmaps Exist: ${duplicateRoadmaps}`);

  const duplicateNodes = new Set(nodes.map(n => n.title + n.roadmapId)).size !== nodes.length;
  console.log(`Duplicate Nodes Exist: ${duplicateNodes}`);

  console.log('\n=== METRICS ===');
  console.log(`SOURCE NODE COUNT: ${sourceNodeCount}`);
  console.log(`DATABASE NODE COUNT: ${nodes.length}`);
  console.log(`ACTIVE ROADMAP NODE COUNT: ${nodes.filter(n => roadmaps.some(r => r.id === n.roadmapId)).length}`);
  console.log(`ORPHAN NODE COUNT: ${orphanNodes.length}`);
  console.log(`STUB NODE COUNT: ${nodesMissingResources.length}`);
  console.log(`DUPLICATE NODE COUNT: ${nodes.length - new Set(nodes.map(n => n.title + n.roadmapId)).size}`);
}

main().finally(() => prisma.$disconnect());
