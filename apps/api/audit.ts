import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/devtodev?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const nodes = await prisma.roadmapNode.findMany();
  
  let withResource = 0;
  let missingResource = 0;
  let invalidUrl = 0;

  for (const node of nodes) {
    if (node.recommendedBookTitle && node.recommendedBookUrl) {
      withResource++;
      if (!node.recommendedBookUrl.startsWith('http')) {
        invalidUrl++;
        console.warn(`[WARN] Node "${node.title}" has an invalid Book URL: ${node.recommendedBookUrl}`);
      }
    } else {
      missingResource++;
      console.warn(`[WARN] Node "${node.title}" is missing Book resource information.`);
    }

    if (!node.videoTitle || !node.videoUrl) {
      console.warn(`[WARN] Node "${node.title}" is missing Video resource information.`);
    }
  }

  console.log('----------------------------------------------------');
  console.log('Resource Audit Results:');
  console.log(`Total Nodes: ${nodes.length}`);
  console.log(`Nodes with Resource: ${withResource}`);
  console.log(`Nodes missing Resource: ${missingResource}`);
  console.log(`Nodes with Invalid URL: ${invalidUrl}`);
  console.log('----------------------------------------------------');
  
  if (missingResource === 0 && invalidUrl === 0 && nodes.length === 179) {
    console.log('[SUCCESS] All 179 nodes have valid recommended resources!');
  } else {
    console.log('[FAILED] Audit did not pass entirely.');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
