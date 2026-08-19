import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/devtodev?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkUrl(url) {
  try {
    const res = await fetch(url);
    return res.status;
  } catch (e) {
    return 0;
  }
}

async function main() {
  const rs = await prisma.roadmapNodeSkill.findMany({
    include: {
      node: {
        include: {
          roadmap: true
        }
      }
    }
  });

  console.log(`Auditing ${rs.length} RoadmapNodeSkill relationships...`);
  
  let valid = 0;
  let broken = 0;

  for (const item of rs) {
    if (!item.node || !item.node.roadmap) {
      console.log(`Invalid relationship data for ID: ${item.id}`);
      broken++;
      continue;
    }
    const slug = item.node.roadmap.slug;
    const nodeId = item.node.id;
    const url = `http://127.0.0.1:3000/roadmaps/${slug}/${nodeId}`;
    
    const status = await checkUrl(url);
    if (status === 200) {
      valid++;
    } else {
      console.log(`[BROKEN] HTTP ${status} for ${url}`);
      broken++;
    }
  }

  console.log(`\nValid course-material links: ${valid === rs.length ? 'ALL' : valid}`);
  console.log(`Broken course-material links: ${broken}`);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
