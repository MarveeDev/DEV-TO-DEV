/**
 * Ghana phone number normalization/validation.
 *
 * Kept isolated so we can expand to other countries later without touching
 * callers. Only E.164-compatible Ghana numbers are accepted in this phase.
 */
export const GHANA_COUNTRY_CODE = '233';

/** Ghana national (subscriber) numbers are 9 digits starting with 2, 3, or 5. */
const GHANA_NATIONAL_NUMBER = /^[235]\d{8}$/;

/**
 * Normalizes a Ghana phone number to E.164 format (`+233XXXXXXXXX`).
 *
 * Accepts international (`+233244000000`, `233244000000`, `00233244000000`)
 * and local (`0244000000`) formats. Returns `null` for anything that is not a
 * valid Ghana number; it never guesses or invents a number.
 */
export function normalizeGhanaPhone(input: string): string | null {
  if (!input) {
    return null;
  }

  let value = input.trim().replace(/[\s\-().]/g, '');

  if (value.startsWith('+')) {
    value = value.slice(1);
  } else if (value.startsWith('00')) {
    value = value.slice(2);
  }

  let national: string;
  if (value.startsWith(GHANA_COUNTRY_CODE)) {
    national = value.slice(GHANA_COUNTRY_CODE.length);
  } else if (value.startsWith('0')) {
    national = value.slice(1);
  } else {
    return null;
  }

  if (!GHANA_NATIONAL_NUMBER.test(national)) {
    return null;
  }

  return `+${GHANA_COUNTRY_CODE}${national}`;
}

/** Returns true when the input is a valid Ghana phone number. */
export function isValidGhanaPhone(input: string): boolean {
  return normalizeGhanaPhone(input) !== null;
}
