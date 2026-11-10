/**
 * Pure, dependency-free sitemap entry definitions.
 *
 * Kept free of `next` imports so it can be unit-tested with Node's built-in
 * test runner. `sitemap.ts` consumes these to guarantee the same public-only
 * path list is covered by the safety tests.
 */

export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface StaticSitemapEntry {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}

/**
 * Static, always-public routes included in the sitemap. None of these may be
 * private, authenticated, or an API route.
 */
export const SITEMAP_STATIC_PATHS: StaticSitemapEntry[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/developers", changeFrequency: "daily", priority: 0.8 },
  { path: "/roadmaps", changeFrequency: "weekly", priority: 0.9 },
  { path: "/projects", changeFrequency: "daily", priority: 0.8 },
  { path: "/questions", changeFrequency: "daily", priority: 0.8 },
  { path: "/marketplace", changeFrequency: "daily", priority: 0.8 },
  { path: "/videos", changeFrequency: "weekly", priority: 0.5 },
];

/**
 * Public dynamic route templates expanded into the sitemap from public API
 * endpoints. The first segment of each template is a public index route.
 */
export const SITEMAP_DYNAMIC_TEMPLATES: string[] = [
  "/roadmaps/:slug",
  "/projects/:slug",
  "/questions/:id",
  "/marketplace/:id",
  "/developers/:username",
];
