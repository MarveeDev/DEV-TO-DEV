import type { Metadata } from "next";

export const SITE_NAME = "DEV-TO-DEV";
export const TAGLINE = "Learn. Connect. Build. Grow.";

// Centralized site URL. Override with NEXT_PUBLIC_SITE_URL once the final
// domain is purchased; defaults to the currently configured production domain.
export const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.FRONTEND_URL ||
  "https://devtodev.online"
).replace(/\/+$/, "");

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
  type?: "website" | "article";
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
