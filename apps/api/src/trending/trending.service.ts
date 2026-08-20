import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class TrendingService {
  private readonly logger = new Logger(TrendingService.name);
  private readonly CACHE_KEY = 'trending:topics';
  private readonly CACHE_TTL_SECONDS = 3600; // 1 hour

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getTrendingTopics() {
    try {
      // 1. Try Cache First
      const cached = await this.redis.getClient().get(this.CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }

      // 2. Compute if Cache miss (Future background worker can do this ahead of time)
      const trending = await this.computeTrendingTopics();

      // 3. Cache the result
      await this.redis.getClient().setex(this.CACHE_KEY, this.CACHE_TTL_SECONDS, JSON.stringify(trending));
      
      return trending;
    } catch (e) {
      this.logger.error('Error fetching trending topics', e);
      // Fallback in case Redis fails
      return this.computeTrendingTopics();
    }
  }

  private async computeTrendingTopics() {
    // Basic aggregation logic: fetch top used skills in posts, projects, and questions
    const [posts, projects, questions] = await Promise.all([
      this.prisma.postSkill.groupBy({
        by: ['skillId'],
        _count: { skillId: true },
        orderBy: { _count: { skillId: 'desc' } },
        take: 20
      }),
      this.prisma.projectSkill.groupBy({
        by: ['skillId'],
        _count: { skillId: true },
        orderBy: { _count: { skillId: 'desc' } },
        take: 20
      }),
      this.prisma.questionSkill.groupBy({
        by: ['skillId'],
        _count: { skillId: true },
        orderBy: { _count: { skillId: 'desc' } },
        take: 20
      })
    ]);

    // Aggregate counts
    const scores = new Map<string, number>();

    posts.forEach(p => {
      scores.set(p.skillId, (scores.get(p.skillId) || 0) + p._count.skillId * 1); // weight 1
    });
    projects.forEach(p => {
      scores.set(p.skillId, (scores.get(p.skillId) || 0) + p._count.skillId * 5); // weight 5
    });
    questions.forEach(q => {
      scores.set(q.skillId, (scores.get(q.skillId) || 0) + q._count.skillId * 2); // weight 2
    });

    const sortedIds = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);

    if (sortedIds.length === 0) {
      // Fallback: Just return generic categories if database has no activity
      return [
        { name: 'AI / Machine Learning', slug: 'machine-learning' },
        { name: 'Web Development', slug: 'react' },
        { name: 'Cloud Computing', slug: 'aws' },
        { name: 'Cybersecurity', slug: 'cybersecurity' },
        { name: 'DevOps', slug: 'docker' },
      ];
    }

    const skills = await this.prisma.skill.findMany({
      where: { id: { in: sortedIds } }
    });

    return sortedIds
      .map(id => skills.find(s => s.id === id))
      .filter(Boolean)
      .map(s => ({
        name: s!.name,
        slug: s!.slug,
        score: scores.get(s!.id)
      }));
  }
}
