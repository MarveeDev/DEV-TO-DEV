import type { MetadataRoute } from "next";
import { DEPLOYMENT_URL } from "../lib/seo";
import { buildRobotsPolicy } from "../lib/robots-policy";

export default function robots(): MetadataRoute.Robots {
  return buildRobotsPolicy(DEPLOYMENT_URL);
}
