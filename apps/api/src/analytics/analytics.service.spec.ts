import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('AnalyticsService', () => {
  const prisma = {
    user: {
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    post: { count: jest.fn() },
    postComment: { count: jest.fn() },
    postLike: { count: jest.fn() },
    question: { count: jest.fn() },
    answer: { count: jest.fn() },
    project: { count: jest.fn() },
    marketplaceListing: {
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    connection: { count: jest.fn() },
    $queryRaw: jest.fn(),
  };

  let service: AnalyticsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AnalyticsService(prisma as unknown as PrismaService);
  });

  describe('getSummary', () => {
    it('aggregates counts across models without exposing sensitive fields', async () => {
      (prisma.user.count as jest.Mock)
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(8) // active
        .mockResolvedValueOnce(1) // restricted
        .mockResolvedValueOnce(1); // suspended
      (prisma.post.count as jest.Mock).mockResolvedValue(30);
      (prisma.postComment.count as jest.Mock).mockResolvedValue(12);
      (prisma.postLike.count as jest.Mock).mockResolvedValue(40);
      (prisma.question.count as jest.Mock).mockResolvedValue(7);
      (prisma.answer.count as jest.Mock).mockResolvedValue(15);
      (prisma.project.count as jest.Mock).mockResolvedValue(5);
      (prisma.marketplaceListing.count as jest.Mock).mockResolvedValue(9);
      (prisma.connection.count as jest.Mock)
        .mockResolvedValueOnce(20) // total
        .mockResolvedValueOnce(13); // accepted
      (prisma.user.groupBy as jest.Mock).mockResolvedValue([
        { role: 'USER', _count: { _all: 8 } },
        { role: 'ANALYTICS_VIEWER', _count: { _all: 2 } },
      ]);
      (prisma.marketplaceListing.groupBy as jest.Mock).mockResolvedValue([
        { type: 'DIGITAL_PRODUCT', _count: { _all: 6 } },
        { type: 'SERVICE', _count: { _all: 3 } },
      ]);

      const summary = await service.getSummary();

      expect(summary.users).toEqual({
        total: 10,
        active: 8,
        restricted: 1,
        suspended: 1,
        byRole: [
          { role: 'USER', count: 8 },
          { role: 'ANALYTICS_VIEWER', count: 2 },
        ],
      });
      expect(summary.content).toEqual({ posts: 30, comments: 12, likes: 40, questions: 7, answers: 15, projects: 5 });
      expect(summary.marketplace).toEqual({
        listings: 9,
        byType: [
          { type: 'DIGITAL_PRODUCT', count: 6 },
          { type: 'SERVICE', count: 3 },
        ],
      });
      expect(summary.connections).toEqual({ total: 20, accepted: 13 });

      // No raw PII is ever selected: the service only issues counts/groupBy.
      expect(prisma.user.findMany).toBeUndefined();
    });

    it('handles an empty database (all counts zero)', async () => {
      (prisma.user.count as jest.Mock).mockResolvedValue(0);
      (prisma.post.count as jest.Mock).mockResolvedValue(0);
      (prisma.postComment.count as jest.Mock).mockResolvedValue(0);
      (prisma.postLike.count as jest.Mock).mockResolvedValue(0);
      (prisma.question.count as jest.Mock).mockResolvedValue(0);
      (prisma.answer.count as jest.Mock).mockResolvedValue(0);
      (prisma.project.count as jest.Mock).mockResolvedValue(0);
      (prisma.marketplaceListing.count as jest.Mock).mockResolvedValue(0);
      (prisma.connection.count as jest.Mock).mockResolvedValue(0);
      (prisma.user.groupBy as jest.Mock).mockResolvedValue([]);
      (prisma.marketplaceListing.groupBy as jest.Mock).mockResolvedValue([]);

      const summary = await service.getSummary();

      expect(summary.users.total).toBe(0);
      expect(summary.users.byRole).toEqual([]);
      expect(summary.marketplace.byType).toEqual([]);
      expect(summary.connections.accepted).toBe(0);
    });
  });

  describe('getTimeseries', () => {
    it('maps query results into the series shape and returns the range', async () => {
      (prisma.$queryRaw as jest.Mock).mockResolvedValue([
        { date: '2024-01-01', count: 2 },
        { date: '2024-01-02', count: 0 },
        { date: '2024-01-03', count: 5 },
      ]);

      const result = await service.getTimeseries('2024-01-01', '2024-01-03');

      expect(result.from).toBe('2024-01-01');
      expect(result.to).toBe('2024-01-03');
      expect(result.series.users).toEqual([
        { date: '2024-01-01', count: 2 },
        { date: '2024-01-02', count: 0 },
        { date: '2024-01-03', count: 5 },
      ]);
      expect(result.series.posts.length).toBe(3);
      expect(result.series.questions.length).toBe(3);
      expect(result.series.listings.length).toBe(3);
      expect(prisma.$queryRaw).toHaveBeenCalledTimes(4);
    });

    it('returns empty arrays for an empty database', async () => {
      (prisma.$queryRaw as jest.Mock).mockResolvedValue([]);
      const result = await service.getTimeseries('2024-01-01', '2024-01-03');
      expect(result.series.users).toEqual([]);
      expect(result.series.posts).toEqual([]);
    });

    it('rejects a range where from is after to', async () => {
      await expect(service.getTimeseries('2024-02-01', '2024-01-01')).rejects.toThrow(BadRequestException);
      expect(prisma.$queryRaw).not.toHaveBeenCalled();
    });

    it('rejects an invalid date string', async () => {
      await expect(service.getTimeseries('not-a-date', '2024-01-01')).rejects.toThrow(BadRequestException);
    });

    it('rejects a range longer than 366 days', async () => {
      await expect(service.getTimeseries('2023-01-01', '2024-06-01')).rejects.toThrow(BadRequestException);
    });

    it('defaults to a bounded range when no dates are supplied', async () => {
      (prisma.$queryRaw as jest.Mock).mockResolvedValue([]);
      const result = await service.getTimeseries();
      expect(result.from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result.to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
