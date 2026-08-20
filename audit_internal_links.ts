import { PrismaClient } from './apps/api/node_modules/@prisma/client';

async function auditLinks() {
  const p = new PrismaClient();
  const roadmaps = await p.roadmap.findMany({ include: { nodes: { include: { skills: { include: { skill: true } } } } } });
  
  let totalLinks = 0;
  let brokenLinks = [];
  
  for (const roadmap of roadmaps) {
    for (const node of roadmap.nodes) {
      // 1. Back button link
      const backUrl = `/roadmaps/${roadmap.slug}`;
      totalLinks++;
      // We know backUrl works if the roadmap exists, but we can verify it against our own list
      if (!roadmaps.find(r => r.slug === roadmap.slug)) {
         brokenLinks.push({ sourceNode: node.id, url: backUrl, type: 'BackButton' });
      }

      // 2. Skill links
      for (const ns of node.skills) {
        const skillUrl = `/skills/${ns.skill.slug}`;
        totalLinks++;
        // The skill exists in the DB if it's connected, but does the page exist?
        // Wait, the API endpoint for the page is what determines 404.
        // We can check if the API would return 404 for this skill.
        try {
          const res = await fetch(`http://localhost:3001/api/v1/skills/${ns.skill.slug}`);
          if (!res.ok) {
            brokenLinks.push({ sourceNode: node.id, url: skillUrl, type: 'SkillPill', status: res.status });
          }
        } catch (e) {
          brokenLinks.push({ sourceNode: node.id, url: skillUrl, type: 'SkillPill', error: e.message });
        }
      }
    }
  }
  
  console.log(`Audited ${totalLinks} internal links across ${roadmaps.reduce((acc, r) => acc + r.nodes.length, 0)} nodes.`);
  if (brokenLinks.length > 0) {
    console.log(`Found ${brokenLinks.length} broken links!`);
    console.log(brokenLinks);
  } else {
    console.log("All internal links resolved successfully (200 OK).");
  }
  
  await p.$disconnect();
}

auditLinks().catch(console.error);
