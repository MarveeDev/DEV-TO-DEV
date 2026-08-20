const { PrismaClient } = require('./apps/api/node_modules/@prisma/client');
const p = new PrismaClient();
p.roadmapNode.findMany({where: {title: 'Basics'}}).then(console.log).finally(() => p.$disconnect());
