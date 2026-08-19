import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { roadmapsData } from './roadmaps.data';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/devtodev?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = {
  'Programming Languages': ['Python', 'JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Kotlin', 'Swift', 'Dart', 'Ruby', 'R'],
  'Frontend': ['HTML', 'CSS', 'React', 'Next.js', 'Vue', 'Nuxt', 'Angular', 'Svelte', 'Tailwind CSS'],
  'Backend': ['Node.js', 'NestJS', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel', 'ASP.NET'],
  'Databases': ['PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Redis', 'Elasticsearch', 'Firebase', 'Supabase'],
  'DevOps / Cloud': ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'Azure', 'Google Cloud', 'CI/CD', 'GitHub Actions', 'Linux', 'Nginx'],
  'AI / Machine Learning': ['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Generative AI', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy'],
  'Cybersecurity': ['Cybersecurity', 'Ethical Hacking', 'Penetration Testing', 'Network Security', 'Application Security', 'Web Security', 'Cryptography', 'Digital Forensics', 'Security Testing'],
  'Architecture / Engineering': ['System Design', 'Distributed Systems', 'Microservices', 'REST APIs', 'GraphQL', 'gRPC', 'WebSockets', 'Event-Driven Architecture', 'Software Architecture', 'Design Patterns'],
  'Mobile': ['Android', 'iOS', 'Flutter', 'React Native', 'Kotlin Android', 'SwiftUI'],
  'Networking': ['TCP/IP', 'DNS', 'HTTP', 'Networking', 'Network Administration', 'Network Programming']
};

const learningGoals = [
  'Become a Software Engineer', 'Learn Machine Learning', 'Learn Artificial Intelligence', 'Learn Cybersecurity', 'Learn System Design', 'Learn Cloud Computing', 'Learn DevOps', 'Learn Backend Development', 'Learn Frontend Development', 'Learn Mobile Development', 'Learn Data Science', 'Learn Open Source', 'Improve Coding Skills', 'Find a Mentor', 'Collaborate on Projects', 'Prepare for Technical Interviews', 'Build Production Applications'
];

async function main() {
  for (const [catName, skills] of Object.entries(categories)) {
    const categorySlug = catName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const category = await prisma.skillCategory.upsert({
      where: { slug: categorySlug },
      update: { name: catName },
      create: { name: catName, slug: categorySlug },
    });

    for (const skillName of skills) {
      const skillSlug = skillName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      await prisma.skill.upsert({
        where: { slug: skillSlug },
        update: { name: skillName, categoryId: category.id },
        create: { name: skillName, slug: skillSlug, categoryId: category.id },
      });
    }
  }

  for (const goalName of learningGoals) {
    const goalSlug = goalName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    await prisma.learningGoal.upsert({
      where: { slug: goalSlug },
      update: { name: goalName },
      create: { name: goalName, slug: goalSlug },
    });
  }

  // Seed Roadmaps
  for (const roadmap of roadmapsData) {
    // Check for circular dependencies
    const graph = new Map<string, string[]>();
    for (const node of roadmap.nodes) {
      graph.set(node.key, node.prerequisites);
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();
    let hasCycle = false;

    const dfs = (nodeKey: string) => {
      if (recStack.has(nodeKey)) return true;
      if (visited.has(nodeKey)) return false;
      visited.add(nodeKey);
      recStack.add(nodeKey);
      const neighbors = graph.get(nodeKey) || [];
      for (const n of neighbors) {
        if (dfs(n)) return true;
      }
      recStack.delete(nodeKey);
      return false;
    };

    for (const key of graph.keys()) {
      if (dfs(key)) {
        hasCycle = true;
        break;
      }
    }

    if (hasCycle) {
      console.error(`Circular dependency detected in roadmap: ${roadmap.title}`);
      continue; // skip this roadmap
    }

    const createdRoadmap = await prisma.roadmap.upsert({
      where: { slug: roadmap.slug },
      update: {
        title: roadmap.title,
        description: roadmap.description,
        category: roadmap.category,
        difficulty: roadmap.difficulty,
        estimatedHours: roadmap.estimatedHours,
      },
      create: {
        title: roadmap.title,
        slug: roadmap.slug,
        description: roadmap.description,
        category: roadmap.category,
        difficulty: roadmap.difficulty,
        estimatedHours: roadmap.estimatedHours,
      },
    });

    const keyToId = new Map<string, string>();

    // Pass 1: Upsert nodes
    for (const node of roadmap.nodes) {
      const existingNodes = await prisma.roadmapNode.findMany({
        where: { roadmapId: createdRoadmap.id, title: node.title }
      });
      
      let targetNode = existingNodes.length > 0 ? existingNodes[0] : null;
      
      if (targetNode) {
        targetNode = await prisma.roadmapNode.update({
          where: { id: targetNode.id },
          data: {
            description: node.description,
            learningObjectives: node.learningObjectives || [],
            topics: node.topics || [],
            practicalExercise: node.practicalExercise || null,
            stage: node.stage,
            order: node.order,
            estimatedHours: node.estimatedHours,
            recommendedBookTitle: node.recommendedBookTitle || null,
            recommendedBookAuthor: node.recommendedBookAuthor || null,
            recommendedBookUrl: node.recommendedBookUrl || null,
            recommendedBookDescription: node.recommendedBookDescription || null,
            resourceType: node.resourceType || null,
            videoTitle: node.videoTitle || null,
            videoInstructor: node.videoInstructor || null,
            videoUrl: node.videoUrl || null,
            videoDescription: node.videoDescription || null,
            videoDuration: node.videoDuration || null,
            videoPlatform: node.videoPlatform || null,
            videoType: node.videoType || null,
          }
        });
      } else {
        targetNode = await prisma.roadmapNode.create({
          data: {
            roadmapId: createdRoadmap.id,
            title: node.title,
            description: node.description,
            learningObjectives: node.learningObjectives || [],
            topics: node.topics || [],
            practicalExercise: node.practicalExercise || null,
            stage: node.stage,
            order: node.order,
            estimatedHours: node.estimatedHours,
            recommendedBookTitle: node.recommendedBookTitle || null,
            recommendedBookAuthor: node.recommendedBookAuthor || null,
            recommendedBookUrl: node.recommendedBookUrl || null,
            recommendedBookDescription: node.recommendedBookDescription || null,
            resourceType: node.resourceType || null,
            videoTitle: node.videoTitle || null,
            videoInstructor: node.videoInstructor || null,
            videoUrl: node.videoUrl || null,
            videoDescription: node.videoDescription || null,
            videoDuration: node.videoDuration || null,
            videoPlatform: node.videoPlatform || null,
            videoType: node.videoType || null,
          }
        });
      }
      keyToId.set(node.key, targetNode.id);
    }

    // Pass 2: Upsert prerequisites
    for (const node of roadmap.nodes) {
      const nodeId = keyToId.get(node.key);
      if (!nodeId) continue;

      for (const prereqKey of node.prerequisites) {
        const prereqId = keyToId.get(prereqKey);
        if (!prereqId) continue;

        await prisma.roadmapNodePrerequisite.upsert({
          where: {
            nodeId_prerequisiteId: {
              nodeId,
              prerequisiteId: prereqId,
            }
          },
          update: {},
          create: {
            nodeId,
            prerequisiteId: prereqId,
          }
        });
      }
    }

    // Pass 3: Upsert skills
    for (const node of roadmap.nodes) {
      const nodeId = keyToId.get(node.key);
      if (!nodeId || !node.skills) continue;

      for (const skillName of node.skills) {
        const skillSlug = skillName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const skill = await prisma.skill.upsert({
          where: { slug: skillSlug },
          update: { name: skillName },
          create: { name: skillName, slug: skillSlug }
        });

        await prisma.roadmapNodeSkill.upsert({
          where: {
            nodeId_skillId: {
              nodeId,
              skillId: skill.id
            }
          },
          update: {},
          create: {
            nodeId,
            skillId: skill.id
          }
        });
      }
    }
  }

  console.log('Seed data inserted successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
