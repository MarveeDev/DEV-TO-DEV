import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SITEMAP_STATIC_PATHS,
  SITEMAP_DYNAMIC_TEMPLATES,
} from "./sitemap-policy.ts";
import { DISALLOW_PATHS, NOINDEX_PATHS } from "./robots-policy.ts";

function isDisallowed(path: string, disallow: string[]): boolean {
  return disallow.some((entry) => {
    // Wildcard create/edit forms never match sitemap paths; skip them.
    if (entry.includes("*")) return false;
    return path === entry || path.startsWith(entry + "/");
  });
}

test("sitemap static paths contain no private or API routes", () => {
  const paths = SITEMAP_STATIC_PATHS.map((e) => e.path);
  for (const path of paths) {
    assert.equal(
      isDisallowed(path, DISALLOW_PATHS),
      false,
      `${path} must not be in the sitemap`,
    );
    assert.equal(
      isDisallowed(path, NOINDEX_PATHS),
      false,
      `${path} is noindex-only and must not be in the sitemap`,
    );
  }
});

test("sitemap dynamic templates use public route prefixes only", () => {
  for (const template of SITEMAP_DYNAMIC_TEMPLATES) {
    const firstSegment = "/" + template.split("/")[1];
    assert.equal(
      isDisallowed(firstSegment, DISALLOW_PATHS),
      false,
      `${template} resolves under a private route`,
    );
  }
});

test("sitemap static paths are non-empty and cover the core public routes", () => {
  const paths = SITEMAP_STATIC_PATHS.map((e) => e.path);
  assert.ok(paths.includes("/"));
  assert.ok(paths.includes("/developers"));
  assert.ok(paths.includes("/projects"));
  assert.ok(paths.includes("/roadmaps"));
  assert.ok(paths.includes("/questions"));
  assert.ok(paths.includes("/marketplace"));
});
