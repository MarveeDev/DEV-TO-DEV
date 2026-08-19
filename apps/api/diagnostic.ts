import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  console.log('Starting global navigation audit...');

  // Setup Prisma with Neon Database URL
  const connectionString = 'postgresql://neondb_owner:npg_qYH40trZQkXe@ep-lucky-truth-ax271rv4-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  
  const skills = await prisma.skill.findMany({
    include: {
      roadmaps: {
        include: {
          node: {
            include: {
              roadmap: true
            }
          }
        }
      }
    }
  });

  let totalRelationships = 0;
  let valid = 0;
  let invalid = 0;
  let missingNodeIds = 0;
  let invalidRoadmapSlugs = 0;
  let notFound = 0;
  let wrongDestinations = 0;

  for (const s of skills) {
    for (const rs of s.roadmaps) {
      totalRelationships++;
      
      const nodeId = rs.node?.id;
      const roadmapSlug = rs.node?.roadmap?.slug;

      if (!nodeId) missingNodeIds++;
      if (!roadmapSlug) invalidRoadmapSlugs++;

      if (nodeId && roadmapSlug) {
        const expectedUrl = `/roadmaps/${roadmapSlug}/${nodeId}`;
        try {
          const res = await fetch(`http://localhost:3001/api/v1/roadmaps/nodes/${nodeId}`);
          if (res.status === 404) {
            notFound++;
            invalid++;
            console.log(`❌ 404 Not Found: ${expectedUrl}`);
            continue;
          }
          const nodeData = await res.json();
          if (nodeData.id !== nodeId) {
            wrongDestinations++;
            invalid++;
            console.log(`❌ Wrong Destination: expected ${nodeId}, got ${nodeData.id}`);
          } else {
            valid++;
          }
        } catch (e: any) {
          console.log(`❌ Fetch failed for ${expectedUrl}: ${e.message}`);
          invalid++;
        }
      } else {
        invalid++;
      }
    }
  }

  console.log('\n--- AUDIT RESULTS ---');
  console.log(`Total relationships: ${totalRelationships}`);
  console.log(`Valid: ${valid}`);
  console.log(`Invalid: ${invalid}`);
  console.log(`Missing node IDs: ${missingNodeIds}`);
  console.log(`Invalid roadmap slugs: ${invalidRoadmapSlugs}`);
  console.log(`404 nodes: ${notFound}`);
  console.log(`Wrong destinations: ${wrongDestinations}`);

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
