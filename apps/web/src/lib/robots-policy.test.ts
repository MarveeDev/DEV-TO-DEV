import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isProductionSite,
  buildRobotsPolicy,
  resolveCanonicalUrl,
  canonicalUrlFor,
  PRODUCTION_SITE_URL,
  DISALLOW_PATHS,
  NOINDEX_PATHS,
  type RobotsRule,
} from "./robots-policy.ts";

test("isProductionSite is true only for the canonical production domain", () => {
  assert.equal(isProductionSite("https://devtodev.online"), true);
  assert.equal(isProductionSite("https://devtodev.online/"), true);
  assert.equal(isProductionSite("http://devtodev.online"), true);
  assert.equal(
    isProductionSite("https://web-service-production-9eb3.up.railway.app"),
    false,
  );
  assert.equal(isProductionSite("http://localhost:3000"), false);
  assert.equal(isProductionSite("https://staging.example.com"), false);
  assert.equal(isProductionSite("not a url"), false);
});

test("off production, crawlers are fully disallowed and no sitemap is advertised", () => {
  const policy = buildRobotsPolicy(
    "https://web-service-production-9eb3.up.railway.app",
  );
  const rules = policy.rules as RobotsRule[];
  assert.equal(rules.length, 1);
  assert.equal(rules[0].userAgent, "*");
  assert.equal(rules[0].disallow, "/");
  assert.equal(policy.sitemap, undefined);
});

test("production policy never serves Disallow: / (it allows public content)", () => {
  const policy = buildRobotsPolicy("https://devtodev.online");
  const rules = policy.rules as RobotsRule[];
  assert.equal(rules[0].userAgent, "*");
  assert.equal(rules[0].allow, "/");
  // Safety: production must never emit a blanket Disallow: /.
  assert.notEqual(rules[0].disallow, "/");
});

test("production allows public content and advertises the canonical sitemap", () => {
  const policy = buildRobotsPolicy("https://devtodev.online");
  assert.equal(policy.sitemap, "https://devtodev.online/sitemap.xml");

  const rules = policy.rules as RobotsRule[];
  const disallow = rules[0].disallow as string[];

  for (const blocked of [
    "/api",
    "/dashboard",
    "/admin",
    "/settings",
    "/messages",
    "/notifications",
    "/support",
    "/onboarding",
    "/profile",
    "/search",
    "/projects/create",
    "/questions/ask",
  ]) {
    assert.ok(disallow.includes(blocked), `expected ${blocked} to be disallowed`);
  }

  for (const publicPath of [
    "/developers",
    "/projects",
    "/roadmaps",
    "/questions",
    "/marketplace",
    "/skills",
    "/sounds",
    "/videos",
    "/trending",
  ]) {
    assert.ok(
      !disallow.includes(publicPath),
      `expected ${publicPath} NOT to be disallowed`,
    );
  }
});

test("public developer profiles are never disallowed", () => {
  const policy = buildRobotsPolicy("https://devtodev.online");
  const rules = policy.rules as RobotsRule[];
  const disallow = rules[0].disallow as string[];

  // /developers index and any /developers/<username> profile must stay crawlable.
  assert.ok(!disallow.includes("/developers"));
  assert.ok(!disallow.some((p) => p.startsWith("/developers/")));
});

test("crawlable noindex pages are kept out of Disallow so noindex is discoverable", () => {
  const policy = buildRobotsPolicy("https://devtodev.online");
  const rules = policy.rules as RobotsRule[];
  const disallow = rules[0].disallow as string[];

  for (const noindex of NOINDEX_PATHS) {
    assert.ok(
      !disallow.includes(noindex),
      `${noindex} should be noindex-only, not disallowed`,
    );
  }
  // Sanity: the noindex set is non-empty and includes the auth-flow pages.
  assert.ok(NOINDEX_PATHS.includes("/login"));
});

test("staging never advertises a production sitemap", () => {
  const policy = buildRobotsPolicy(
    "https://web-service-production-9eb3.up.railway.app",
  );
  assert.equal(policy.sitemap, undefined);
});

test("the disallow list does not accidentally contain a blanket '/', '/developers', or public roots", () => {
  assert.ok(!DISALLOW_PATHS.includes("/"));
  assert.ok(!DISALLOW_PATHS.includes("/developers"));
  assert.ok(!DISALLOW_PATHS.includes("/projects"));
  assert.ok(!DISALLOW_PATHS.includes("/questions"));
  assert.ok(!DISALLOW_PATHS.includes("/marketplace"));
  assert.ok(!DISALLOW_PATHS.includes("/roadmaps"));
});

test("canonical URL always resolves to the production domain, never a staging host", () => {
  assert.equal(resolveCanonicalUrl(undefined), "https://devtodev.online");
  assert.equal(resolveCanonicalUrl(""), "https://devtodev.online");
  assert.equal(resolveCanonicalUrl("https://devtodev.online"), "https://devtodev.online");
  assert.equal(resolveCanonicalUrl("https://devtodev.online/"), "https://devtodev.online");

  // Safety: the default canonical URL must never be a Railway/staging domain.
  assert.equal(PRODUCTION_SITE_URL, "https://devtodev.online");
  assert.ok(!PRODUCTION_SITE_URL.includes(".up.railway.app"));
  assert.ok(isProductionSite(resolveCanonicalUrl(undefined)));
});

test("canonicalUrlFor builds absolute production canonical URLs", () => {
  assert.equal(
    canonicalUrlFor("https://devtodev.online", "/skills/react"),
    "https://devtodev.online/skills/react",
  );
  assert.equal(
    canonicalUrlFor("https://devtodev.online/", "/videos"),
    "https://devtodev.online/videos",
  );
  assert.equal(
    canonicalUrlFor("https://devtodev.online", "/"),
    "https://devtodev.online/",
  );
});

test("private account routes (e.g. /profile) are non-indexable", () => {
  assert.ok(DISALLOW_PATHS.includes("/profile"));
  assert.ok(DISALLOW_PATHS.includes("/dashboard"));
  assert.ok(DISALLOW_PATHS.includes("/settings"));
  assert.ok(DISALLOW_PATHS.includes("/admin"));

  // Public profile routes must remain indexable.
  assert.ok(!DISALLOW_PATHS.includes("/developers"));
});
