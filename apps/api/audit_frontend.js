const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function audit() {
  const nodes = await prisma.roadmapNode.findMany({
    include: { roadmap: true }
  });
  
  console.log('Total nodes:', nodes.length);
  let success = 0;
  let failed = 0;
  
  const batchSize = 10;
  for (let i = 0; i < nodes.length; i += batchSize) {
    const batch = nodes.slice(i, i + batchSize);
    const promises = batch.map(async (n) => {
      const url = 'http://localhost:3000/roadmaps/' + encodeURIComponent(n.roadmap.slug) + '/' + encodeURIComponent(n.id);
      try {
        const res = await fetch(url);
        if (res.status === 200) success++;
        else {
          failed++;
          console.error('Failed:', url, res.status);
        }
      } catch (e) {
        failed++;
        console.error('Error:', url, e.message);
      }
    });
    await Promise.all(promises);
  }
  
  console.log('Audit complete:', { success, failed });
}

audit().finally(() => prisma.$disconnect());
