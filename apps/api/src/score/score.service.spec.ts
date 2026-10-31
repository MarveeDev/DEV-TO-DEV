import { ScoreService } from './score.service';
import { PrismaService } from '../prisma/prisma.service';
import { utcDay, addUtcDays } from './score-rules';

describe('ScoreService.award', () => {
  const prisma = {
    developerProfile: { findUnique: jest.fn() },
    $transaction: jest.fn(),
  };

  let tx: any;
  let service: ScoreService;

  const today = () => utcDay(new Date());

  function mockScore(overrides: Record<string, unknown> = {}) {
    const score = {
      id: 's1',
      score: 0,
      streak: 0,
      postsCount: 0,
      connectionsCount: 0,
      projectsCount: 0,
      lastActivityDate: null as Date | null,
      dailyPostCount: 0,
      dailyConnectionCount: 0,
      ...overrides,
    };
    tx.developerScore.findUnique.mockResolvedValue(score);
    return score;
  }

  beforeEach(() => {
    jest.clearAllMocks();
    tx = {
      $executeRaw: jest.fn().mockResolvedValue(undefined),
      developerScore: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn().mockResolvedValue({}) },
      developerScoreEvent: { create: jest.fn().mockResolvedValue({}) },
    };
    prisma.$transaction.mockImplementation(async (fn: (t: unknown) => Promise<unknown>) => fn(tx));
    prisma.developerProfile.findUnique.mockResolvedValue({ id: 'p1' });
    service = new ScoreService(prisma as unknown as PrismaService);
  });

  describe('post rewards and daily cap', () => {
    it('first qualifying post on a new day awards 5 + 15 streak bonus', async () => {
      mockScore();
      await service.award('u1', 'POST_CREATED', 'post1');

      expect(tx.developerScore.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            score: { increment: 20 },
            streak: 1,
            dailyPostCount: 1,
            postsCount: { increment: 1 },
          }),
        }),
      );
    });

    it('second and third posts award 5 each without a second streak bonus', async () => {
      mockScore({ lastActivityDate: today(), dailyPostCount: 1, streak: 1, score: 20, postsCount: 1 });
      await service.award('u1', 'POST_CREATED', 'post2');

      expect(tx.developerScore.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            score: { increment: 5 },
            streak: 1,
            dailyPostCount: 2,
          }),
        }),
      );
    });

    it('fourth post receives no reward (daily cap of 3)', async () => {
      mockScore({ lastActivityDate: today(), dailyPostCount: 3, streak: 1, score: 30, postsCount: 3 });
      await service.award('u1', 'POST_CREATED', 'post4');

      expect(tx.developerScore.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            score: { increment: 0 },
            streak: 1,
            dailyPostCount: 3,
            postsCount: { increment: 1 },
          }),
        }),
      );
      expect(tx.developerScoreEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ points: 0 }) }),
      );
    });

    it('a post on a consecutive day extends the streak and resets the daily count', async () => {
      mockScore({
        lastActivityDate: addUtcDays(today(), -1),
        dailyPostCount: 3,
        streak: 4,
        score: 100,
        postsCount: 10,
      });
      await service.award('u1', 'POST_CREATED', 'postNewDay');

      expect(tx.developerScore.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            score: { increment: 20 },
            streak: 5,
            dailyPostCount: 1,
          }),
        }),
      );
    });

    it('a post after a missed day resets the streak to 1', async () => {
      mockScore({
        lastActivityDate: addUtcDays(today(), -3),
        dailyPostCount: 2,
        streak: 9,
        score: 200,
      });
      await service.award('u1', 'POST_CREATED', 'postAfterGap');

      expect(tx.developerScore.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ streak: 1, score: { increment: 20 } }),
        }),
      );
    });
  });

  describe('connections', () => {
    it('accepted connection awards 5 points without affecting the streak', async () => {
      mockScore();
      await service.award('u1', 'CONNECTION_ACCEPTED', 'conn1');

      expect(tx.developerScore.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            score: { increment: 5 },
            connectionsCount: { increment: 1 },
            dailyConnectionCount: 1,
            streak: 0,
          }),
        }),
      );
    });
  });

  describe('other activities', () => {
    it('PROJECT_CREATED awards fixed points and increments projectsCount without streak', async () => {
      mockScore();
      await service.award('u1', 'PROJECT_CREATED', 'proj1');

      expect(tx.developerScore.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            score: { increment: 20 },
            projectsCount: { increment: 1 },
            streak: 0,
            postsCount: { increment: 0 },
          }),
        }),
      );
    });
  });

  describe('idempotency and safety', () => {
    it('a duplicate event is not awarded twice', async () => {
      mockScore();
      tx.developerScoreEvent.create.mockRejectedValue({ code: 'P2002' });

      await service.award('u1', 'CONNECTION_ACCEPTED', 'conn1');

      expect(tx.developerScore.update).not.toHaveBeenCalled();
    });

    it('ignores unknown event types', async () => {
      mockScore();
      await service.award('u1', 'NOT_A_REAL_TYPE' as never, 'x');
      expect(tx.developerScoreEvent.create).not.toHaveBeenCalled();
    });

    it('ignores awards for a user without a developer profile', async () => {
      prisma.developerProfile.findUnique.mockResolvedValue(null);
      await service.award('u1', 'POST_CREATED', 'post1');
      expect(tx.developerScoreEvent.create).not.toHaveBeenCalled();
    });

    it('creates the score row on the first award', async () => {
      tx.developerScore.findUnique.mockResolvedValue(null);
      tx.developerScore.create.mockResolvedValue({
        id: 's1', score: 0, streak: 0, postsCount: 0, connectionsCount: 0, projectsCount: 0,
        lastActivityDate: null, dailyPostCount: 0, dailyConnectionCount: 0,
      });
      await service.award('u1', 'POST_CREATED', 'post1');
      expect(tx.developerScore.create).toHaveBeenCalledWith({ data: { developerProfileId: 'p1' } });
    });
  });
});
