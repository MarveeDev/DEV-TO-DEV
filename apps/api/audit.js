const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function audit() {
  const roadmaps = await prisma.roadmap.count();
  const nodes = await prisma.roadmapNode.count();
  const withLearning = await prisma.roadmapNode.count({
    where: { description: { not: null }, learningObjectives: { isEmpty: false } }
  });
  const withSkills = await prisma.roadmapNode.count({
    where: { skills: { some: {} } }
  });
  const withReading = await prisma.roadmapNode.count({
    where: { recommendedBookUrl: { not: null } }
  });
  const withVideo = await prisma.roadmapNode.count({
    where: { videoUrl: { not: null } }
  });
  console.log({ roadmaps, nodes, withLearning, withSkills, withReading, withVideo });
}
audit().finally(() => prisma.$disconnect());
