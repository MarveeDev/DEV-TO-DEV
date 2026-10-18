import { QuestionsService } from './questions.service';
import { PrismaService } from '../prisma/prisma.service';
import { MAX_LIMIT } from '../common/pagination';

describe('QuestionsService pagination', () => {
  const prisma = {
    question: { findMany: jest.fn(), findUnique: jest.fn(), count: jest.fn() },
    questionVote: { aggregate: jest.fn() },
    answerVote: { aggregate: jest.fn() },
  };
  const cloudinaryService = { deleteFile: jest.fn() };
  const scoreService = { award: jest.fn() };
  const publicCache = { get: jest.fn(), set: jest.fn() };

  let service: QuestionsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new QuestionsService(
      prisma as unknown as PrismaService,
      cloudinaryService as never,
      scoreService as never,
      publicCache as never,
    );
  });

  describe('getQuestionById', () => {
    const author = { id: 'a', displayName: 'A', username: 'a', avatarUrl: null };

    it('bounds nested answers and re-orders them ascending', async () => {
      publicCache.get.mockResolvedValue(null);
      publicCache.set.mockResolvedValue(undefined);
      prisma.question.findUnique.mockResolvedValue({
        id: 'q1',
        answers: [
          { id: 'a2', createdAt: new Date('2024-01-02'), author },
          { id: 'a1', createdAt: new Date('2024-01-01'), author },
        ],
        _count: { answers: 5 },
      });
      prisma.questionVote.aggregate.mockResolvedValue({ _sum: { value: 2 } });
      prisma.answerVote.aggregate.mockResolvedValue({ _sum: { value: 1 } });

      const result = await service.getQuestionById('q1');

      expect(prisma.question.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'q1' },
          include: expect.objectContaining({
            answers: expect.objectContaining({
              orderBy: { createdAt: 'desc' },
              take: MAX_LIMIT,
            }),
          }),
        }),
      );
      expect(result.answers.map((a) => a.id)).toEqual(['a1', 'a2']);
      expect(result.voteScore).toBe(2);
    });
  });
});
