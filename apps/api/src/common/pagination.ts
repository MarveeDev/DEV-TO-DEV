export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_PAGE = 1_000_000;
export const MAX_LIMIT = 100;

export interface PaginationInput {
  page?: unknown;
  limit?: unknown;
}

export interface NormalizedPagination {
  page: number;
  limit: number;
  skip: number;
}

/**
 * Coerces a client-supplied page/limit value into a safe positive integer.
 *
 * Missing, non-numeric (NaN), non-finite (Infinity), zero, and negative values
 * resolve to `fallback`. Fractional values are floored, so a value like `2.9`
 * becomes `2` rather than being passed through to the database.
 */
function toPositiveInteger(value: unknown, fallback: number): number {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) {
    return fallback;
  }
  const floored = Math.floor(num);
  return floored < 1 ? fallback : floored;
}

/**
 * Normalizes page/limit inputs for Prisma queries.
 *
 * - `page` is at least 1 and never exceeds `MAX_PAGE`.
 * - `limit` is at least 1 and never exceeds `MAX_LIMIT`.
 * - `skip` is always non-negative, finite, and within the signed 32-bit
 *   integer range accepted by Prisma.
 *
 * Callers may pass raw query-string values (strings), numbers, or undefined.
 */
export function normalizePagination(
  input: PaginationInput = {},
  defaultLimit: number = DEFAULT_LIMIT,
): NormalizedPagination {
  const page = Math.min(toPositiveInteger(input.page, DEFAULT_PAGE), MAX_PAGE);
  const limit = Math.min(MAX_LIMIT, toPositiveInteger(input.limit, defaultLimit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
