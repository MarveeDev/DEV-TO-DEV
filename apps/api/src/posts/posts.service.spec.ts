import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { MAX_LIMIT } from '../common/pagination';

describe('PostsService pagination', () => {
  const prisma = {
    post: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    postLike: { findMany: jest.fn() },
    postComment: { findMany: jest.fn() },
  };
  const scoreService = { award: jest.fn() };
  const cloudinaryService = { deleteFile: jest.fn() };

  let service: PostsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PostsService(
      prisma as unknown as PrismaService,
      scoreService as never,
      cloudinaryService as never,
    );
  });

  describe('getPosts', () => {
    it('caps the limit and preserves the response shape', async () => {
      prisma.post.count.mockResolvedValue(5);
      prisma.post.findMany.mockResolvedValue([]);
      prisma.postLike.findMany.mockResolvedValue([]);

      const result = await service.getPosts({ page: 1, limit: 100000 }, 'v1');

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: MAX_LIMIT }),
      );
      expect(result).toEqual({
        data: [],
        meta: { total: 5, page: 1, limit: MAX_LIMIT, totalPages: 1 },
      });
    });

    it('normalizes negative and malformed inputs to safe defaults', async () => {
      prisma.post.count.mockResolvedValue(0);
      prisma.post.findMany.mockResolvedValue([]);

      await service.getPosts({ page: -5, limit: 'abc' });

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 20 }),
      );
    });
  });

  describe('getComments', () => {
    const profile = { username: 'u', displayName: 'U' };

    it('bounds comments to the most recent and returns ascending order', async () => {
      prisma.post.findUnique.mockResolvedValue({ id: 'p1' });
      prisma.postComment.findMany.mockResolvedValue([
        {
          id: 'c2',
          content: 'second',
          createdAt: new Date('2024-01-02'),
          authorId: 'a2',
          author: { developerProfile: profile },
        },
        {
          id: 'c1',
          content: 'first',
          createdAt: new Date('2024-01-01'),
          authorId: 'a1',
          author: { developerProfile: profile },
        },
      ]);

      const result = await service.getComments('p1');

      expect(prisma.postComment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { postId: 'p1' },
          orderBy: { createdAt: 'desc' },
          take: MAX_LIMIT,
        }),
      );
      expect(result.map((c) => c.id)).toEqual(['c1', 'c2']);
    });

    it('propagates database errors', async () => {
      prisma.post.findUnique.mockResolvedValue({ id: 'p1' });
      const boom = new Error('db down');
      prisma.postComment.findMany.mockRejectedValue(boom);

      await expect(service.getComments('p1')).rejects.toBe(boom);
    });
  });
});
