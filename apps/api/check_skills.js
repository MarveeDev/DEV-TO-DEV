const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const skills = await prisma.skill.findMany({
    where: { name: { in: ['Computer Architecture', 'Operating Systems', 'Linux'] } }
  });
  console.log(JSON.stringify(skills, null, 2));

  // Find roadmap nodes that map to these skills
  const nodes = await prisma.roadmapNode.findMany({
    where: { title: 'Computer Fundamentals' },
    include: {
      skills: {
        include: { skill: true }
      }
    }
  });
  console.log(JSON.stringify(nodes, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
