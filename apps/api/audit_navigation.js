const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/devtodev?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function audit() {
  const stats = {
    totalSkillsChecked: 0,
    totalRoadmapNodesChecked: 0,
    totalRoadmapLinksChecked: 0,
    totalSkillLinksChecked: 0,
    totalProjectLinksChecked: 0,
    totalQuestionLinksChecked: 0,
    totalPostLinksChecked: 0,
    pass: 0,
    fail: 0,
    warnings: 0
  };

  const failures = [];

  function addFail(reason, data) {
    stats.fail++;
    failures.push({ reason, ...data });
  }

  try {
    console.log("Fetching global data from Prisma...");
    
    // 1. Fetch all roadmaps & nodes
    const roadmaps = await prisma.roadmap.findMany({
      include: { nodes: true }
    });
    
    const nodes = await prisma.roadmapNode.findMany({
      include: { 
        roadmap: true,
        skills: { include: { skill: true } }
      }
    });

    // 2. Fetch all skills and their relations
    const skills = await prisma.skill.findMany({
      include: {
        roadmaps: { include: { node: { include: { roadmap: true } } } },
        projects: { include: { project: true } },
        questions: { include: { question: true } },
        posts: { include: { post: true } }
      }
    });

    stats.totalSkillsChecked = skills.length;
    stats.totalRoadmapNodesChecked = nodes.length;

    console.log(`Auditing ${skills.length} skills and ${nodes.length} nodes...`);

    // --- NODE AUDIT ---
    for (const node of nodes) {
      if (!node.id) addFail("Missing node ID", { nodeName: node.title });
      if (!node.roadmap) addFail("Node missing roadmap relationship", { nodeName: node.title, nodeId: node.id });
      
      const expectedUrl = `/roadmaps/${node.roadmap.slug}/${node.id}`;
      // In frontend, we navigate to this.

      for (const ns of node.skills) {
        stats.totalSkillLinksChecked++;
        if (!ns.skill || !ns.skill.slug) {
          addFail("Roadmap Node Skill missing slug", { nodeName: node.title, nodeId: node.id, skillId: ns.skillId });
        } else {
          // Verify API for this skill
          try {
            const res = await fetch(`http://localhost:3001/api/v1/skills/${encodeURIComponent(ns.skill.slug)}`);
            if (!res.ok) {
              addFail(`Skill API returned ${res.status}`, { 
                skillName: ns.skill.name, 
                skillSlug: ns.skill.slug, 
                nodeName: node.title,
                expectedUrl: `/api/v1/skills/${ns.skill.slug}`
              });
            } else {
              stats.pass++;
            }
          } catch (e) {
             addFail(`Skill API fetch failed`, { skillSlug: ns.skill.slug, error: e.message });
          }
        }
      }

      // Check node API endpoint
      try {
        const res = await fetch(`http://localhost:3001/api/v1/roadmaps/nodes/${encodeURIComponent(node.id)}`);
        if (!res.ok) {
          addFail(`Node API returned ${res.status}`, { nodeName: node.title, nodeId: node.id });
        } else {
          stats.pass++;
        }
      } catch (e) {
         addFail(`Node API fetch failed`, { nodeId: node.id, error: e.message });
      }
    }

    // --- SKILL AUDIT ---
    for (const skill of skills) {
      if (!skill.slug) addFail("Skill missing slug", { skillName: skill.name, skillId: skill.id });
      
      // Audit roadmap curriculum links from this skill
      for (const rs of skill.roadmaps) {
        stats.totalRoadmapLinksChecked++;
        if (!rs.node || !rs.node.roadmap) {
          addFail("Skill roadmap curriculum link broken", { skillName: skill.name, skillSlug: skill.slug });
        } else {
          const expectedUrl = `/roadmaps/${rs.node.roadmap.slug}/${rs.node.id}`;
          if (!rs.node.roadmap.slug || !rs.node.id) {
             addFail("Malformed roadmap URL params in skill", { skillName: skill.name, expectedUrl });
          } else {
             stats.pass++;
          }
        }
      }

      // Projects
      for (const ps of skill.projects) {
        stats.totalProjectLinksChecked++;
        if (!ps.project || !ps.project.slug) {
          addFail("Skill project link broken", { skillName: skill.name });
        } else {
          stats.pass++;
        }
      }

      // Questions
      for (const qs of skill.questions) {
        stats.totalQuestionLinksChecked++;
        if (!qs.question || !qs.question.id) {
          addFail("Skill question link broken", { skillName: skill.name });
        } else {
          stats.pass++;
        }
      }

      // Posts
      for (const ps of skill.posts) {
        stats.totalPostLinksChecked++;
        if (!ps.post || !ps.post.id) {
          addFail("Skill post link broken", { skillName: skill.name });
        } else {
          stats.pass++;
        }
      }
    }

    console.log("\n--- AUDIT REPORT ---");
    console.log(`Total skills checked: ${stats.totalSkillsChecked}`);
    console.log(`Total roadmap nodes checked: ${stats.totalRoadmapNodesChecked}`);
    console.log(`Total roadmap links checked: ${stats.totalRoadmapLinksChecked}`);
    console.log(`Total skill links checked: ${stats.totalSkillLinksChecked}`);
    console.log(`Total project links checked: ${stats.totalProjectLinksChecked}`);
    console.log(`Total question links checked: ${stats.totalQuestionLinksChecked}`);
    console.log(`Total post links checked: ${stats.totalPostLinksChecked}`);
    console.log(`PASS: ${stats.pass}`);
    console.log(`FAIL: ${stats.fail}`);
    console.log(`WARNINGS: ${stats.warnings}`);

    if (failures.length > 0) {
      console.log("\nFAILURES:");
      failures.forEach((f, i) => {
        console.log(`[${i+1}] ${f.reason}`);
        console.log(JSON.stringify(f, null, 2));
      });
      process.exit(1);
    } else {
      console.log("\n✅ ZERO CRITICAL NAVIGATION FAILURES.");
    }
  } catch (e) {
    console.error("Audit script crashed:", e);
    process.exit(1);
  }
}

audit().finally(() => prisma.$disconnect());
