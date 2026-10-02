import { normalizePhone } from './phone.util';

describe('normalizePhone', () => {
  describe('valid international numbers', () => {
    it.each([
      ['+14155552671', '+14155552671'],
      ['+442079460958', '+442079460958'],
      ['+233244000000', '+233244000000'],
    ])('normalizes %s to %s', (input, expected) => {
      expect(normalizePhone(input)).toBe(expected);
    });
  });

  describe('Ghana backward compatibility', () => {
    it.each([
      ['0244000000', '+233244000000'],
      ['+233244000000', '+233244000000'],
      ['233244000000', '+233244000000'],
      ['00233244000000', '+233244000000'],
    ])('normalizes %s to %s', (input, expected) => {
      expect(normalizePhone(input)).toBe(expected);
    });
  });

  describe('separators', () => {
    it.each([
      ['+1 415 555 2671', '+14155552671'],
      ['+1-415-555-2671', '+14155552671'],
      ['+44 (20) 7946 0958', '+442079460958'],
    ])('normalizes %s to %s', (input, expected) => {
      expect(normalizePhone(input)).toBe(expected);
    });
  });

  describe('invalid input', () => {
    it.each(['+999999', '+1', '+0000000000', '+12345', 'abc', ''])(
      'returns null for %s',
      (input) => {
        expect(normalizePhone(input)).toBeNull();
      },
    );
  });

  describe('ambiguous bare numbers', () => {
    it('does not guess a country for a bare US-looking number', () => {
      expect(normalizePhone('4155552671')).toBeNull();
    });
  });
});
