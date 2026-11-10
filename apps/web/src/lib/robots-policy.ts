/**
 * Pure, dependency-free SEO policy for the DEV-TO-DEV web app.
 *
 * Kept free of `next` imports so it can be unit-tested with Node's built-in
 * test runner, matching the pattern used by `canonical-host.ts`.
 */

export const PRODUCTION_HOST = "devtodev.online";

/** Canonical production origin. Never a staging/Railway preview domain. */
export const PRODUCTION_SITE_URL = `https://${PRODUCTION_HOST}`;

export interface RobotsRule {
  userAgent: string;
  allow?: string | string[];
  disallow?: string | string[];
}

export interface RobotsPolicy {
  rules: RobotsRule | RobotsRule[];
  sitemap?: string;
}

/**
 * robots.txt `Disallow` — pages that must never be crawled.
 *
 * These are hard-private, auth-required areas (the proxy 307-redirects any
 * unauthenticated crawler to /login) plus the `/api` backend proxy. Disallowing
 * them saves crawl budget and avoids exposing internal route names. Wildcard
 * `*` entries (create/edit mutation forms) are a widely-supported extension;
 * crawlers that ignore `*` simply miss that single directive, and those pages
 * are auth-redirected + noindexed anyway.
 */
export const DISALLOW_PATHS = [
  "/api",
  "/dashboard",
  "/admin",
  "/settings",
  "/messages",
  "/notifications",
  "/network",
  "/actions",
  "/search",
  "/onboarding",
  "/profile",
  "/support",
  "/projects/create",
  "/projects/*/edit",
  "/questions/ask",
  "/marketplace/create",
  "/marketplace/my-listings",
  "/posts/create",
  "/posts/*/edit",
];

/**
 * Crawlable-but-noindexed pages. These are deliberately kept OUT of the
 * robots.txt `Disallow` list so crawlers can reach them and discover the
 * `X-Robots-Tag: noindex` directive applied by `src/proxy.ts`.
 */
export const NOINDEX_PATHS = ["/login", "/activate", "/feed", "/code"];

/**
 * Only the canonical production domain is indexable. Every other deployment
 * (Railway preview/staging domains, localhost) must stay out of search results.
 */
export function isProductionSite(siteUrl: string): boolean {
  try {
    return new URL(siteUrl).hostname === PRODUCTION_HOST;
  } catch {
    return false;
  }
}

/**
 * Resolves the canonical site URL. Falls back to the production domain; the
 * optional override is the final purchased domain (never a staging host), so a
 * canonical URL can never point at a staging/Railway preview domain.
 */
export function resolveCanonicalUrl(configuredUrl?: string): string {
  return (configuredUrl || PRODUCTION_SITE_URL).replace(/\/+$/, "");
}

/** Builds an absolute canonical URL for a given path. */
export function canonicalUrlFor(siteUrl: string, path: string): string {
  return `${siteUrl.replace(/\/+$/, "")}${path}`;
}

export function buildRobotsPolicy(siteUrl: string): RobotsPolicy {
  if (!isProductionSite(siteUrl)) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW_PATHS,
      },
    ],
    sitemap: `${siteUrl.replace(/\/+$/, "")}/sitemap.xml`,
  };
}
