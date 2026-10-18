import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
  MAX_PAGE,
  normalizePagination,
} from './pagination';

describe('normalizePagination', () => {
  it('returns defaults when no input is provided', () => {
    expect(normalizePagination()).toEqual({
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      skip: 0,
    });
  });

  it('accepts numeric and string values', () => {
    expect(normalizePagination({ page: '2', limit: '5' })).toEqual({
      page: 2,
      limit: 5,
      skip: 5,
    });
    expect(normalizePagination({ page: 3, limit: 10 })).toEqual({
      page: 3,
      limit: 10,
      skip: 20,
    });
  });

  it('falls back for missing, non-numeric, and empty values', () => {
    expect(normalizePagination({ page: undefined, limit: undefined })).toEqual({
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      skip: 0,
    });
    expect(normalizePagination({ page: 'abc', limit: 'xyz' })).toEqual({
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      skip: 0,
    });
    expect(normalizePagination({ page: '', limit: '' })).toEqual({
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      skip: 0,
    });
  });

  it('falls back for zero, negative, and non-finite values', () => {
    expect(normalizePagination({ page: 0, limit: 0 })).toEqual({
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      skip: 0,
    });
    expect(normalizePagination({ page: -3, limit: -10 })).toEqual({
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      skip: 0,
    });
    expect(
      normalizePagination({ page: Infinity, limit: Infinity }),
    ).toEqual({ page: DEFAULT_PAGE, limit: DEFAULT_LIMIT, skip: 0 });
  });

  it('floors fractional values to positive integers', () => {
    expect(normalizePagination({ page: '2.9', limit: '10.7' })).toEqual({
      page: 2,
      limit: 10,
      skip: 10,
    });
    expect(normalizePagination({ page: 1.5, limit: 20.5 })).toEqual({
      page: 1,
      limit: 20,
      skip: 0,
    });
  });

  it('caps the limit at the maximum and keeps skip non-negative', () => {
    expect(normalizePagination({ page: 1, limit: 1000000 })).toEqual({
      page: 1,
      limit: MAX_LIMIT,
      skip: 0,
    });
    expect(normalizePagination({ page: 999999, limit: MAX_LIMIT })).toEqual({
      page: 999999,
      limit: MAX_LIMIT,
      skip: (999999 - 1) * MAX_LIMIT,
    });
  });

  it('honors a custom default limit', () => {
    expect(normalizePagination({}, 10)).toEqual({
      page: DEFAULT_PAGE,
      limit: 10,
      skip: 0,
    });
    expect(normalizePagination({ page: '2' }, 10)).toEqual({
      page: 2,
      limit: 10,
      skip: 10,
    });
  });

  it('never produces a negative skip', () => {
    const { skip } = normalizePagination({ page: -100, limit: -100 });
    expect(skip).toBeGreaterThanOrEqual(0);
  });

  describe('page clamping', () => {
    const INT32_MAX = 2147483647;

    it('caps an extreme page at MAX_PAGE', () => {
      const result = normalizePagination({ page: '1e10' });
      expect(result.page).toBe(MAX_PAGE);
      expect(Number.isFinite(result.skip)).toBe(true);
      expect(result.skip).toBeGreaterThanOrEqual(0);
      expect(result.skip).toBeLessThanOrEqual(INT32_MAX);
    });

    it('keeps skip finite and in-range for a page that would otherwise overflow', () => {
      const result = normalizePagination({ page: '1e307', limit: 100 });
      expect(result.page).toBe(MAX_PAGE);
      expect(Number.isFinite(result.skip)).toBe(true);
      expect(result.skip).toBe((MAX_PAGE - 1) * 100);
      expect(result.skip).toBeLessThanOrEqual(INT32_MAX);
    });

    it('accepts exactly MAX_PAGE and yields an in-range skip', () => {
      const result = normalizePagination({ page: MAX_PAGE, limit: 100 });
      expect(result.page).toBe(MAX_PAGE);
      expect(result.skip).toBe((MAX_PAGE - 1) * 100);
      expect(result.skip).toBeLessThanOrEqual(INT32_MAX);
    });

    it('does not clamp pages below MAX_PAGE', () => {
      const result = normalizePagination({ page: 5, limit: 10 });
      expect(result.page).toBe(5);
      expect(result.skip).toBe(40);
    });
  });
});
