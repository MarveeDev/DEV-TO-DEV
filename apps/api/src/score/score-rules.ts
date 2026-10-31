import { ScoreEventType } from '@prisma/client';

/**
 * Centralized gamification rules. Point values live here — never in callers —
 * so a caller cannot accidentally (or maliciously) change the awarded amount.
 *
 * Only the categories below are part of the approved product scheme. The
 * "daily streak bonus" (15) and the 3-post daily cap apply to POST_CREATED
 * only; connections and other activities award their fixed points and do not
 * drive the streak.
 */
export const SCORE_POINTS: Record<ScoreEventType, number> = {
  POST_CREATED: 5,
  POST_COMMENTED: 3,
  POST_RECEIVED_COMMENT: 3,
  POST_LIKED: 2,
  QUESTION_CREATED: 8,
  QUESTION_RECEIVED_ANSWER: 2,
  QUESTION_UPVOTED: 3,
  ANSWER_CREATED: 10,
  ANSWER_UPVOTED: 3,
  ANSWER_ACCEPTED: 25,
  PROJECT_CREATED: 20,
  PROJECT_RECEIVED_CONTRIBUTOR: 10,
  CONNECTION_ACCEPTED: 5,
  ROADMAP_NODE_COMPLETED: 10,
  ROADMAP_COMPLETED: 50,
};

/** Bonus awarded once per qualifying UTC day (on the first qualifying post). */
export const STREAK_BONUS_POINTS = 15;

/** Maximum number of rewarded posts in a single UTC day. */
export const MAX_REWARDED_POSTS_PER_DAY = 3;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Truncates a Date to the start of its UTC day (00:00:00Z). */
export function utcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

/** Adds `n` whole days to a UTC-midnight date. */
export function addUtcDays(day: Date, n: number): Date {
  return new Date(day.getTime() + n * DAY_MS);
}
