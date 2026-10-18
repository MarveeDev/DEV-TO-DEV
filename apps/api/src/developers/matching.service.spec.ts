import { MatchingService } from './matching.service';
import { PrismaService } from '../prisma/prisma.service';

function profileWith(userId: string, skills: string[], goals: string[], level: string) {
  return {
    id: `profile-${userId}`,
    userId,
    experienceLevel: level,
    skills: skills.map((name) => ({ skillId: name, skill: { id: name, name } })),
    learningGoals: goals.map((name) => ({
      learningGoalId: name,
      learningGoal: { id: name, name },
    })),
  };
}

describe('MatchingService pagination', () => {
  const prisma = {
    developerProfile: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    connection: { findMany: jest.fn() },
  };

  let service: MatchingService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MatchingService(prisma as unknown as PrismaService);
  });

  it('ranks by score and bounds the response via normalized skip/limit', async () => {
    prisma.developerProfile.findUnique.mockResolvedValue(
      profileWith('me', ['React'], ['Docker'], 'BEGINNER'),
    );
    prisma.connection.findMany.mockResolvedValue([]);
    // devA shares a skill + experience => higher score; devB only shares a goal.
    prisma.developerProfile.findMany.mockResolvedValue([
      profileWith('b', [], ['Docker'], 'ADVANCED'),
      profileWith('a', ['React'], [], 'BEGINNER'),
    ]);

    const result = await service.getMatches('me', { page: 1, limit: 1 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].developer.id).toBe('a');
    expect(result.meta.total).toBe(2);
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(1);
    expect(result.meta.totalPages).toBe(2);
  });

  it('caps a large limit at the maximum', async () => {
    prisma.developerProfile.findUnique.mockResolvedValue(
      profileWith('me', [], [], 'BEGINNER'),
    );
    prisma.connection.findMany.mockResolvedValue([]);
    prisma.developerProfile.findMany.mockResolvedValue([]);

    const result = await service.getMatches('me', { page: 1, limit: 100000 });

    expect(result.meta.limit).toBe(100);
  });

  it('propagates database errors', async () => {
    const boom = new Error('db down');
    prisma.developerProfile.findUnique.mockRejectedValue(boom);

    await expect(service.getMatches('me', { page: 1, limit: 20 })).rejects.toBe(
      boom,
    );
  });
});
