import type { Metadata } from "next";
import { getMarketplaceListing } from "../../../lib/api";
import { pageMetadata, truncate } from "../../../lib/seo";
import ListingDetailsClient from "./ListingDetailsClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await getMarketplaceListing(id);

  if (!listing) {
    return pageMetadata({
      title: "Marketplace Listing",
      description: "Discover developer tools and services on the DEV-TO-DEV marketplace.",
      path: `/marketplace/${id}`,
    });
  }

  const description =
    truncate(listing.description) ||
    `${listing.title} on the DEV-TO-DEV marketplace.`;

  return pageMetadata({
    title: `${listing.title} | DEV-TO-DEV Marketplace`,
    description,
    path: `/marketplace/${listing.id}`,
    noBrand: true,
  });
}

export default async function ListingDetailsPage({ params }: Props) {
  const { id } = await params;
  const listing = await getMarketplaceListing(id);
  return <ListingDetailsClient id={id} initialListing={listing} />;
}
