import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const appDir = join(here, "..", "app");

function read(rel: string): string {
  const p = join(appDir, rel);
  assert.ok(existsSync(p), `missing file: ${rel}`);
  return readFileSync(p, "utf8");
}

function hasNoindexRobots(content: string): boolean {
  return content.includes("index: false") && content.includes("follow: false");
}

// Routes that must emit `<meta name="robots" content="noindex, nofollow">`.
// Keyed by a stable route label, mapped to the file that declares the metadata
// (a segment layout.tsx or, for /code, the server page.tsx).
const NOINDEX_ROUTES: Record<string, string> = {
  "/login": "login/layout.tsx",
  "/feed": "feed/layout.tsx",
  "/code": "code/page.tsx",
  "/activate/[token]": "activate/layout.tsx",
  "/onboarding": "onboarding/layout.tsx",
  "/search": "search/layout.tsx",
  "/dashboard": "dashboard/layout.tsx",
  "/settings": "settings/layout.tsx",
  "/messages": "messages/layout.tsx",
  "/notifications": "notifications/layout.tsx",
  "/network": "network/layout.tsx",
  "/actions": "actions/layout.tsx",
  "/profile": "profile/layout.tsx",
  "/admin": "admin/layout.tsx",
  "/support": "support/layout.tsx",
  "/support/[id]": "support/layout.tsx",
};

// Public routes must remain indexable (index, follow).
const PUBLIC_ROUTES = [
  "/",
  "/developers",
  "/projects",
  "/questions",
  "/marketplace",
  "/roadmaps",
  "/skills",
  "/videos",
  "/trending",
  "/sounds",
];

test("every private/auth route declares noindex,nofollow robots metadata", () => {
  for (const [route, file] of Object.entries(NOINDEX_ROUTES)) {
    const content = read(file);
    assert.ok(
      hasNoindexRobots(content),
      `${route} (${file}) must declare robots: { index: false, follow: false }`,
    );
  }
});

test("the login route is explicitly non-indexable", () => {
  const content = read("login/layout.tsx");
  assert.ok(hasNoindexRobots(content));
});

test("no public route is accidentally made non-indexable", () => {
  // Public pages with their own metadata layout must not opt into noindex.
  const publicMetadataFiles = [
    "videos/layout.tsx",
    "trending/layout.tsx",
    "skills/[slug]/layout.tsx",
  ];
  for (const file of publicMetadataFiles) {
    if (!existsSync(join(appDir, file))) continue;
    const content = read(file);
    assert.ok(
      !content.includes("index: false"),
      `${file} must not declare noindex`,
    );
  }

  // None of the public route labels may appear in the noindex route set.
  for (const route of PUBLIC_ROUTES) {
    assert.ok(
      !(route in NOINDEX_ROUTES),
      `${route} must remain indexable and must not be in the noindex set`,
    );
  }
});

test("the root layout still defaults public pages to index,follow", () => {
  const content = read("layout.tsx");
  assert.ok(content.includes("index: true"));
  assert.ok(content.includes("follow: true"));
});

test("the noindex route set is non-empty and covers the auth flow", () => {
  assert.ok("/login" in NOINDEX_ROUTES);
  assert.ok("/dashboard" in NOINDEX_ROUTES);
  assert.ok("/profile" in NOINDEX_ROUTES);
});
