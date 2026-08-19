import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/devtodev?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const nodes = await prisma.roadmapNode.findMany({
    include: { roadmap: true, skills: true, prerequisites: true }
  });

  const nodesMissingResources = nodes.filter(n => !n.recommendedBookTitle || !n.videoTitle);
  
  const stubs = nodesMissingResources.map(n => ({
    id: n.id,
    title: n.title,
    key: n.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    roadmap: n.roadmap?.title,
    roadmapSlug: n.roadmap?.slug
  }));

  fs.writeFileSync('C:\\Users\\HP\\.gemini\\antigravity\\brain\\0d1ff508-b29c-4090-aab6-38f3785f5fca\\scratch\\db_stubs.json', JSON.stringify(stubs, null, 2));
  console.log('Exported ' + stubs.length + ' stubs to db_stubs.json');
}

main().finally(() => prisma.$disconnect());
