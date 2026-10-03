import { estimateSmsUnits } from './sms-units.util';

describe('estimateSmsUnits', () => {
  it('returns 0 for an empty message', () => {
    expect(estimateSmsUnits('')).toBe(0);
  });

  it('returns 1 for a short GSM-7 message', () => {
    expect(estimateSmsUnits('Hello DEV-TO-DEV')).toBe(1);
  });

  it('returns 1 for a 160-character GSM-7 message', () => {
    expect(estimateSmsUnits('a'.repeat(160))).toBe(1);
  });

  it('returns 2 for a 161-character GSM-7 message', () => {
    expect(estimateSmsUnits('a'.repeat(161))).toBe(2);
  });

  it('returns 1 for a short Unicode message', () => {
    expect(estimateSmsUnits('Hello 👋')).toBe(1);
  });

  it('returns 1 for a 70-code-unit Unicode message', () => {
    // 35 emoji = 70 UTF-16 code units.
    expect(estimateSmsUnits('😀'.repeat(35))).toBe(1);
  });

  it('returns 2 for a Unicode message over 70 code units', () => {
    // 36 emoji = 72 UTF-16 code units.
    expect(estimateSmsUnits('😀'.repeat(36))).toBe(2);
  });

  it('treats emoji as Unicode (non-GSM-7)', () => {
    // 2 emoji -> length 4 (UTF-16 code units), still 1 unit under UCS-2.
    expect(estimateSmsUnits('🎉🎉')).toBe(1);
  });
});
