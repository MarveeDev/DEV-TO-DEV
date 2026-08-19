import { roadmapsData } from './prisma/roadmaps.data';
let total = 0;
let incomplete = 0;
for (const rm of roadmapsData) {
  total += rm.nodes.length;
  for (const n of rm.nodes) {
    if (!n.description) incomplete++;
  }
}
console.log('Source nodes:', total, 'Incomplete source nodes:', incomplete);
