/**
 * SMS unit estimation for the GOnline campaign balance gate.
 *
 * GOnline (like most GSM providers) bills by "units":
 * - GSM-7 messages: 160 characters per unit (153 for each additional segment).
 * - Unicode (UCS-2) messages: 70 characters per unit (67 for each additional
 *   segment) — triggered by any character outside the GSM-7 basic alphabet
 *   (emoji, CJK, Arabic, etc.).
 *
 * This is an ESTIMATE, not an exact billing prediction. The precise segment
 * boundary depends on the provider's GSM-7 extended-table escape handling and
 * any operator-specific rules, which the API documentation does not fully
 * specify. `message.length` counts UTF-16 code units (surrogate pairs such as
 * emoji count as two), which is a reasonable proxy for UCS-2 sizing.
 */

const GSM7_BASIC = new Set([
  '@',
  'Δ',
  '_',
  'Φ',
  'Γ',
  'Λ',
  'Ω',
  'Π',
  'Ψ',
  'Σ',
  'Θ',
  'Ξ',
  '£',
  '$',
  '¥',
  'è',
  'é',
  'ù',
  'ì',
  'ò',
  'Ç',
  'Ø',
  'ø',
  'Å',
  'å',
  'Æ',
  'æ',
  'ß',
  'É',
  'Ä',
  'Ö',
  'Ñ',
  'Ü',
  '§',
  '¿',
  '¡',
  'ä',
  'ö',
  'ñ',
  'ü',
  'à',
  ' ',
  '\n',
  '\r',
  '!',
  '"',
  '#',
  '¤',
  '%',
  '&',
  "'",
  '(',
  ')',
  '*',
  '+',
  ',',
  '-',
  '.',
  '/',
  ':',
  ';',
  '<',
  '=',
  '>',
  '?',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
]);

function containsNonGsm7(message: string): boolean {
  for (const ch of message) {
    if (!GSM7_BASIC.has(ch)) {
      return true;
    }
  }
  return false;
}

/**
 * Returns the estimated number of SMS units for the given message, or `0` for
 * an empty message.
 */
export function estimateSmsUnits(message: string): number {
  if (!message) {
    return 0;
  }

  const length = message.length;

  if (containsNonGsm7(message)) {
    // Unicode (UCS-2): 70 chars/single segment, 67 chars per extra segment.
    return length <= 70 ? 1 : 1 + Math.ceil((length - 70) / 67);
  }

  // GSM-7: 160 chars/single segment, 153 chars per extra segment.
  return length <= 160 ? 1 : 1 + Math.ceil((length - 160) / 153);
}
