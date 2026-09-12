import { cache } from "react";

function apiBaseUrl(): string {
  return process.env.INTERNAL_API_URL || "http://api:3001";
}

export async function fetchApi<T = any>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${apiBaseUrl()}/api/v1${path}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const getRoadmaps = cache(() => fetchApi<any[]>("/roadmaps"));
export const getRoadmapBySlug = cache((slug: string) =>
  fetchApi<any>(`/roadmaps/${encodeURIComponent(slug)}`)
);
export const getRoadmapNode = cache((nodeId: string) =>
  fetchApi<any>(`/roadmaps/nodes/${encodeURIComponent(nodeId)}`)
);

export const getProjects = cache((limit = 20) =>
  fetchApi<any>(`/projects?limit=${limit}`)
);
export const getProjectBySlug = cache((slug: string) =>
  fetchApi<any>(`/projects/${encodeURIComponent(slug)}`)
);

export const getQuestions = cache((limit = 20) =>
  fetchApi<any>(`/questions?limit=${limit}`)
);
export const getQuestionById = cache((id: string) =>
  fetchApi<any>(`/questions/${encodeURIComponent(id)}`)
);

export const getMarketplaceListings = cache(() =>
  fetchApi<any[]>("/marketplace")
);
export const getMarketplaceListing = cache((id: string) =>
  fetchApi<any>(`/marketplace/${encodeURIComponent(id)}`)
);

export const getPublicDevelopers = cache((limit = 20) =>
  fetchApi<any>(`/developers/public?limit=${limit}`)
);
export const getPublicDeveloper = cache((username: string) =>
  fetchApi<any>(`/developers/public/${encodeURIComponent(username)}`)
);
