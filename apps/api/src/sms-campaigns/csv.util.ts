/**
 * Minimal, dependency-free CSV parsing for the SMS campaign contact importer.
 *
 * The importer only ever deals with a single "phone number" column, so this
 * parser intentionally stays small. It handles quoted fields, commas inside
 * quotes, and CRLF/LF line endings. Uploaded content is treated as untrusted
 * and never executed.
 */

export interface CsvParseResult {
  headers: string[];
  rows: string[][];
}

export function parseCsv(content: string): CsvParseResult {
  const lines = content.split(/\r?\n/);
  const rows: string[][] = [];
  let headers: string[] = [];
  let first = true;

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }
    const cells = parseCsvLine(line);
    if (first) {
      headers = cells;
      first = false;
    } else {
      rows.push(cells);
    }
  }

  return { headers, rows };
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        cells.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }

  cells.push(current.trim());
  return cells;
}

const PHONE_COLUMN_NAMES = new Set([
  'phone',
  'phonenumber',
  'phonenum',
  'mobile',
  'mobilenumber',
  'mobilenum',
  'tel',
  'telephone',
  'contact',
  'number',
  'cell',
  'cellphone',
]);

/**
 * Finds the phone-number column index. A single-column CSV is always treated
 * as the phone column; otherwise the header name is matched against known
 * variants. Returns `null` when no phone column can be identified, so the
 * importer never silently interprets an unrelated column as a phone number.
 */
export function findPhoneColumn(headers: string[]): number | null {
  if (headers.length === 1) {
    return 0;
  }

  for (let i = 0; i < headers.length; i++) {
    if (PHONE_COLUMN_NAMES.has(normalizeHeader(headers[i]))) {
      return i;
    }
  }

  return null;
}

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}
