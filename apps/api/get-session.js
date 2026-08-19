const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function getSession() {
  const session = await prisma.session.findFirst();
  if (session) {
    console.log(session.id);
  } else {
    console.log('No session found. Creating one...');
    const user = await prisma.user.findFirst();
    if (user) {
      const newSession = await prisma.session.create({
        data: {
          userId: user.id,
          expiresAt: new Date(Date.now() + 100000000)
        }
      });
      console.log(newSession.id);
    }
  }
}
getSession().finally(() => prisma.$disconnect());
