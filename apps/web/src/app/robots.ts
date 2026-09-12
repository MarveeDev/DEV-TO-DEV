import type { MetadataRoute } from "next";
import { BASE_URL } from "../lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/settings",
          "/messages",
          "/notifications",
          "/feed",
          "/network",
          "/actions",
          "/search",
          "/onboarding",
          "/login",
          "/profile",
          "/admin",
          "/admin-login",
          "/projects/create",
          "/projects/*/edit",
          "/questions/ask",
          "/marketplace/create",
          "/marketplace/my-listings",
          "/posts/create",
          "/posts/*/edit",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
