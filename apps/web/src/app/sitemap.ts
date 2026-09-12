import type { MetadataRoute } from "next";
import { BASE_URL } from "../lib/seo";

export const dynamic = "force-dynamic";

async function fetchJson(path: string) {
  try {
    const apiBase = process.env.INTERNAL_API_URL || "http://api:3001";
    const res = await fetch(`${apiBase}/api/v1${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/developers`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/roadmaps`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/projects`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/questions`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/marketplace`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/videos`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];

  // Roadmaps (public)
  const roadmaps = await fetchJson("/roadmaps");
  if (Array.isArray(roadmaps)) {
    for (const r of roadmaps) {
      if (r?.slug) {
        entries.push({
          url: `${BASE_URL}/roadmaps/${r.slug}`,
          lastModified: r.updatedAt ? new Date(r.updatedAt) : now,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  }

  // Projects (public)
  const projects = await fetchJson("/projects?limit=1000");
  if (projects?.items) {
    for (const p of projects.items) {
      if (p?.slug) {
        entries.push({
          url: `${BASE_URL}/projects/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  }

  // Questions (public)
  const questions = await fetchJson("/questions?limit=1000");
  if (questions?.items) {
    for (const q of questions.items) {
      if (q?.id) {
        entries.push({
          url: `${BASE_URL}/questions/${q.id}`,
          lastModified: q.updatedAt ? new Date(q.updatedAt) : now,
          changeFrequency: "daily",
          priority: 0.6,
        });
      }
    }
  }

  // Marketplace listings (public)
  const listings = await fetchJson("/marketplace");
  if (Array.isArray(listings)) {
    for (const l of listings) {
      if (l?.id) {
        entries.push({
          url: `${BASE_URL}/marketplace/${l.id}`,
          lastModified: l.updatedAt ? new Date(l.updatedAt) : now,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  }

  // Developer profiles (public)
  const developers = await fetchJson("/developers/public?limit=1000");
  if (developers?.items) {
    for (const d of developers.items) {
      if (d?.username) {
        entries.push({
          url: `${BASE_URL}/developers/${d.username}`,
          lastModified: d.updatedAt ? new Date(d.updatedAt) : now,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
