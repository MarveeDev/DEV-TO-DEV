import { roadmapsData } from './prisma/roadmaps.data';
import * as fs from 'fs';

const stubs = [];
const videos = [];

for (const r of roadmapsData) {
  for (const n of r.nodes) {
    if (!n.description || !n.videoTitle) {
      stubs.push({
        key: n.key,
        title: n.title,
        roadmap: r.title,
        roadmapSlug: r.slug
      });
    }
    
    if (n.videoUrl) {
      videos.push({
        key: n.key,
        title: n.title,
        roadmap: r.title,
        videoTitle: n.videoTitle,
        videoInstructor: n.videoInstructor,
        videoUrl: n.videoUrl,
        videoPlatform: n.videoPlatform,
        videoType: n.videoType
      });
    }
  }
}

fs.writeFileSync('C:\\Users\\HP\\.gemini\\antigravity\\brain\\0d1ff508-b29c-4090-aab6-38f3785f5fca\\scratch\\stubs.json', JSON.stringify(stubs, null, 2));
fs.writeFileSync('C:\\Users\\HP\\.gemini\\antigravity\\brain\\0d1ff508-b29c-4090-aab6-38f3785f5fca\\scratch\\videos_to_audit.json', JSON.stringify(videos, null, 2));
console.log(`Exported ${stubs.length} stubs and ${videos.length} videos.`);
