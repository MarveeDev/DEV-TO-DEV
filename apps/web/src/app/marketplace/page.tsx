import type { Metadata } from "next";
import { getMarketplaceListings } from "../../lib/api";
import { pageMetadata } from "../../lib/seo";
import MarketplaceClient from "./MarketplaceClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Marketplace",
  description:
    "Discover developer tools, templates, and services on the DEV-TO-DEV marketplace.",
  path: "/marketplace",
});

export default async function MarketplacePage() {
  const listings = await getMarketplaceListings();
  return <MarketplaceClient initialListings={listings} />;
}
