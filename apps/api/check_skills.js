const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const skills = await prisma.skill.findMany();
  console.log(skills.filter(s => s.name.toLowerCase().includes('basic')));
}

run().finally(() => prisma.$disconnect());
