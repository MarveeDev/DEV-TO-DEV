const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.skill.findMany().then(s => console.log(s.filter(x => x.name.toLowerCase().includes('basic')))).finally(() => p.\());
