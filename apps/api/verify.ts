import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const connectionString = 'postgresql://neondb_owner:npg_qYH40trZQkXe@ep-lucky-truth-ax271rv4-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const node = await prisma.roadmapNode.findFirst({
      where: {
        title: 'Operating Systems'
      }
    });

    console.log('--- DATABASE CHECK ---');
    console.log('Title:', node?.title);
    console.log('Objectives type:', typeof node?.learningObjectives);
    console.log('Objectives isArray:', Array.isArray(node?.learningObjectives));
    console.log('Objectives:', node?.learningObjectives);

    console.log('\n--- API CHECK ---');
    if (node) {
      const res = await fetch(`http://localhost:3001/api/v1/roadmaps/nodes/${node.id}`);
      const data = await res.json();
      console.log('API Objectives type:', typeof data.learningObjectives);
      console.log('API Objectives isArray:', Array.isArray(data.learningObjectives));
      console.log('API Objectives:', data.learningObjectives);
    }
  } catch (e: any) {
    console.error(e.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
main();
