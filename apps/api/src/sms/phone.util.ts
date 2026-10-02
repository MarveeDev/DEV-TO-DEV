import { parsePhoneNumberFromString } from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';

const GHANA_COUNTRY_CODE = '233';

/**
 * Normalizes a phone number to E.164 format (`+CCNNNNNNNNN`).
 *
 * Accepted inputs:
 * - International E.164: `+14155552671`, `+442079460958`, `+233244000000`
 * - `00` international prefix: `00233244000000`
 * - Ghana country code without `+`: `233244000000`
 * - Ghana local (leading `0`): `0244000000`
 *
 * Separators (spaces, hyphens, parentheses, dots) are ignored. Returns `null`
 * for anything invalid or ambiguous; it never guesses an arbitrary country.
 */
export function normalizePhone(input: string): string | null {
  if (!input) {
    return null;
  }

  const value = input.trim().replace(/[\s\-().]/g, '');

  if (value.startsWith('+')) {
    return parseE164(value);
  }

  if (value.startsWith('00')) {
    return parseE164(`+${value.slice(2)}`);
  }

  if (value.startsWith(GHANA_COUNTRY_CODE)) {
    return parseE164(`+${value}`);
  }

  if (value.startsWith('0')) {
    return parseE164(value, 'GH');
  }

  return null;
}

function parseE164(value: string, defaultCountry?: CountryCode): string | null {
  const parsed = parsePhoneNumberFromString(value, defaultCountry);
  if (!parsed || !parsed.isValid()) {
    return null;
  }
  return parsed.format('E.164');
}
