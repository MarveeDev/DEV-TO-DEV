import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_RANGE_DAYS = 30;
const MAX_RANGE_DAYS = 366;

export interface RoleCount {
  role: string;
  count: number;
}

export interface TypeCount {
  type: string;
  count: number;
}

export interface DayCount {
  date: string;
  count: number;
}

export interface AnalyticsSummary {
  users: {
    total: number;
    active: number;
    restricted: number;
    suspended: number;
    byRole: RoleCount[];
  };
  content: {
    posts: number;
    comments: number;
    likes: number;
    questions: number;
    answers: number;
    projects: number;
  };
  marketplace: {
    listings: number;
    byType: TypeCount[];
  };
  connections: {
    total: number;
    accepted: number;
  };
}

export interface AnalyticsTimeseries {
  from: string;
  to: string;
  series: {
    users: DayCount[];
    posts: DayCount[];
    questions: DayCount[];
    listings: DayCount[];
  };
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(): Promise<AnalyticsSummary> {
    const [
      totalUsers,
      activeUsers,
      restrictedUsers,
      suspendedUsers,
      posts,
      comments,
      likes,
      questions,
      answers,
      projects,
      listings,
      connections,
      acceptedConnections,
      usersByRole,
      listingsByType,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: 'ACTIVE' } }),
      this.prisma.user.count({ where: { status: 'RESTRICTED' } }),
      this.prisma.user.count({ where: { status: 'SUSPENDED' } }),
      this.prisma.post.count(),
      this.prisma.postComment.count(),
      this.prisma.postLike.count(),
      this.prisma.question.count(),
      this.prisma.answer.count(),
      this.prisma.project.count(),
      this.prisma.marketplaceListing.count(),
      this.prisma.connection.count(),
      this.prisma.connection.count({ where: { status: 'ACCEPTED' } }),
      this.prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
      this.prisma.marketplaceListing.groupBy({ by: ['type'], _count: { _all: true } }),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        restricted: restrictedUsers,
        suspended: suspendedUsers,
        byRole: usersByRole.map((r) => ({ role: r.role, count: r._count._all })),
      },
      content: {
        posts,
        comments,
        likes,
        questions,
        answers,
        projects,
      },
      marketplace: {
        listings,
        byType: listingsByType.map((t) => ({ type: t.type, count: t._count._all })),
      },
      connections: {
        total: connections,
        accepted: acceptedConnections,
      },
    };
  }

  async getTimeseries(from?: string, to?: string): Promise<AnalyticsTimeseries> {
    const { from: fromDate, to: toDate } = this.resolveRange(from, to);
    const fromStr = this.dateKey(fromDate);
    const toStr = this.dateKey(toDate);

    const [users, posts, questions, listings] = await Promise.all([
      this.dailySeries('User', fromStr, toStr),
      this.dailySeries('Post', fromStr, toStr),
      this.dailySeries('Question', fromStr, toStr),
      this.dailySeries('MarketplaceListing', fromStr, toStr),
    ]);

    return {
      from: fromStr,
      to: toStr,
      series: { users, posts, questions, listings },
    };
  }

  private resolveRange(from?: string, to?: string): { from: Date; to: Date } {
    const now = new Date();

    let fromDate: Date;
    let toDate: Date;

    if (from && to) {
      fromDate = this.parseDate(from);
      toDate = this.parseDate(to);
    } else if (from) {
      fromDate = this.parseDate(from);
      toDate = new Date(fromDate.getTime() + DEFAULT_RANGE_DAYS * DAY_MS);
    } else if (to) {
      toDate = this.parseDate(to);
      fromDate = new Date(toDate.getTime() - DEFAULT_RANGE_DAYS * DAY_MS);
    } else {
      toDate = now;
      fromDate = new Date(now.getTime() - DEFAULT_RANGE_DAYS * DAY_MS);
    }

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      throw new BadRequestException('Invalid date range');
    }

    fromDate = this.startOfDayUtc(fromDate);
    toDate = this.startOfDayUtc(toDate);

    if (fromDate.getTime() > toDate.getTime()) {
      throw new BadRequestException('"from" must be on or before "to"');
    }

    const rangeDays = Math.round((toDate.getTime() - fromDate.getTime()) / DAY_MS);
    if (rangeDays > MAX_RANGE_DAYS) {
      throw new BadRequestException(`Date range must not exceed ${MAX_RANGE_DAYS} days`);
    }

    return { from: fromDate, to: toDate };
  }

  private parseDate(value: string): Date {
    const d = new Date(value);
    return d;
  }

  private startOfDayUtc(d: Date): Date {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }

  private dateKey(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  /**
   * Returns one row per calendar day in [fromStr, toStr] (inclusive), zero-filled
   * where no records exist. `table` is an internal whitelist, never user input.
   * Day boundaries use the stored timestamp's own date component, so results are
   * consistent regardless of the database session timezone.
   */
  private async dailySeries(table: 'User' | 'Post' | 'Question' | 'MarketplaceListing', fromStr: string, toStr: string): Promise<DayCount[]> {
    const rows = await this.prisma.$queryRaw<Array<{ date: string; count: number }>>(
      Prisma.sql`
        SELECT to_char(g.day::date, 'YYYY-MM-DD') AS date, COALESCE(m.count, 0) AS count
        FROM generate_series(${fromStr}::date, ${toStr}::date, interval '1 day') AS g(day)
        LEFT JOIN (
          SELECT date_trunc('day', "createdAt")::date AS day, count(*)::int AS count
          FROM ${Prisma.raw(`"${table}"`)}
          WHERE "createdAt" >= ${fromStr}::date AND "createdAt" < (${toStr}::date + interval '1 day')
          GROUP BY 1
        ) AS m ON m.day = g.day::date
        ORDER BY g.day::date
      `,
    );
    return rows.map((r) => ({ date: r.date, count: r.count }));
  }
}
