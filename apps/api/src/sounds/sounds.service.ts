import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_LIMIT = 30;

@Injectable()
export class SoundsService {
  constructor(private prisma: PrismaService) {}

  async getSounds(query: {
    search?: string;
    category?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || DEFAULT_LIMIT));
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { artist: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.category) {
      where.category = { equals: query.category, mode: 'insensitive' };
    }

    let orderBy: any[] = [{ usageCount: 'desc' }, { createdAt: 'desc' }];
    if (query.sort === 'newest') {
      orderBy = [{ createdAt: 'desc' }];
    } else if (query.sort === 'trending') {
      orderBy = [{ usageCount: 'desc' }, { createdAt: 'desc' }];
    }

    const [total, items] = await Promise.all([
      this.prisma.backgroundSound.count({ where }),
      this.prisma.backgroundSound.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          title: true,
          artist: true,
          audioUrl: true,
          duration: true,
          category: true,
          coverImageUrl: true,
          usageCount: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSoundById(id: string) {
    const sound = await this.prisma.backgroundSound.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        artist: true,
        audioUrl: true,
        duration: true,
        category: true,
        coverImageUrl: true,
        usageCount: true,
        isActive: true,
        createdAt: true,
        _count: { select: { posts: true } },
      },
    });

    if (!sound || !sound.isActive) {
      throw new NotFoundException('Sound not found');
    }

    const { isActive, _count, ...rest } = sound;
    return { ...rest, postCount: _count.posts };
  }
}
