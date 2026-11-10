import type { Metadata } from "next";
import { resolveCanonicalUrl } from "./robots-policy";

export const SITE_NAME = "DEV-TO-DEV";
export const TAGLINE = "Learn. Connect. Build. Grow.";

// Canonical production URL. Used for every <link rel=canonical>, Open Graph,
// Twitter, and sitemap URL. NEXT_PUBLIC_* values are inlined by Next.js at
// build time and are the correct source for both statically-generated routes
// (robots.txt) and server-rendered metadata. It must always be the production
// domain — never a staging/Railway preview domain.
export const SITE_URL = resolveCanonicalUrl(process.env.NEXT_PUBLIC_SITE_URL);

// URL this deployment is actually served from. Used ONLY by robots.txt to
// decide whether this build is production (indexable) or staging (disallow).
// Defaults to the canonical URL so production needs no extra config; staging
// MUST set NEXT_PUBLIC_DEPLOYMENT_URL to its own (non-production) domain.
export const DEPLOYMENT_URL = (
  process.env.NEXT_PUBLIC_DEPLOYMENT_URL || SITE_URL
).replace(/\/+$/, "");

// Legacy alias for SITE_URL (canonical production URL).
export const BASE_URL = SITE_URL;

export const SITE_DESCRIPTION =
  "DEV-TO-DEV is the professional network for developers. Learn, connect, build, and grow together — discover collaborators, share projects, ask and answer questions, and follow technology roadmaps.";

const OG_IMAGE = {
  url: `${BASE_URL}/opengraph-image.png`,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — ${TAGLINE}`,
};

export function brand(title: string): string {
  return `${title} | ${SITE_NAME}`;
}

export function truncate(text: string | null | undefined, max = 160): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trimEnd() + "…";
}

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile";
  noBrand?: boolean;
}): Metadata {
  const fullTitle = opts.noBrand ? opts.title : brand(opts.title);
  const url = `${BASE_URL}${opts.path}`;
  return {
    title: fullTitle,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      type: opts.type ?? "website",
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: opts.description,
      images: [`${BASE_URL}/twitter-image.png`],
    },
  };
}
