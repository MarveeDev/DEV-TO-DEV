import * as fs from 'fs';
import { roadmapsData } from './prisma/roadmaps.data';

const allData = JSON.parse(fs.readFileSync('C:/Users/HP/.gemini/antigravity/brain/0d1ff508-b29c-4090-aab6-38f3785f5fca/scratch/alldata_temp.json', 'utf8'));

for (const roadmap of roadmapsData) {
  for (const node of roadmap.nodes) {
    if (allData[node.key]) {
      node.description = allData[node.key].description;
      node.learningObjectives = allData[node.key].learningObjectives;
      node.topics = allData[node.key].topics;
      node.practicalExercise = allData[node.key].practicalExercise;
    }
  }
}

const output = `export type RoadmapNodeData = {
  key: string;
  title: string;
  description: string;
  learningObjectives?: string[];
  topics?: string[];
  practicalExercise?: string;
  stage: string;
  order: number;
  estimatedHours: number;
  prerequisites: string[];
  skills: string[];
};

export type RoadmapData = {
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedHours: number;
  nodes: RoadmapNodeData[];
};

export const roadmapsData: RoadmapData[] = ${JSON.stringify(roadmapsData, null, 2)};
`;

fs.writeFileSync('./prisma/roadmaps.data.ts', output);
console.log('Successfully wrote to roadmaps.data.ts');
