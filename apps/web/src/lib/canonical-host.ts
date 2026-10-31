/**
 * Canonical-domain redirection helpers (server-only).
 *
 * Kept dependency-free (no `next/server` import) so the pure logic can be
 * unit-tested with Node's built-in test runner.
 */

/**
 * Normalizes a configured canonical host into a bare hostname, or `null` when
 * unset/empty. Handles an optional `https://`/`http://` scheme and a trailing
 * slash so operators can set either `devtodev.online` or `https://devtodev.online/`.
 */
export function normalizeCanonicalHost(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withoutScheme = trimmed.replace(/^https?:\/\//i, '');
  const host = withoutScheme.split('/')[0].trim();
  return host || null;
}

/**
 * Returns the canonical URL to redirect a Railway-generated domain to, or
 * `null` when no redirection should occur. Redirection only happens when a
 * canonical host is configured AND the request host is a Railway domain; the
 * path and query string are preserved.
 */
export function buildCanonicalRedirectUrl(
  requestUrl: string,
  host: string,
  canonicalHost: string | null,
): string | null {
  if (!canonicalHost || !host.endsWith('.up.railway.app')) {
    return null;
  }
  const url = new URL(requestUrl);
  url.hostname = canonicalHost;
  url.port = '';
  return url.toString();
}
