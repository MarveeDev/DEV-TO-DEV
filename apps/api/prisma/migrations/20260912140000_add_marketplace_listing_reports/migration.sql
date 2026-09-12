-- CreateEnum
CREATE TYPE "MarketplaceListingReportReason" AS ENUM ('SCAM_FRAUD', 'MISLEADING_INFORMATION', 'COPYRIGHT_INFRINGEMENT', 'PROHIBITED_ITEM', 'SPAM', 'HARASSMENT_ABUSE', 'MALICIOUS_CODE', 'OTHER');

-- CreateEnum
CREATE TYPE "MarketplaceListingReportStatus" AS ENUM ('PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED');

-- CreateTable
CREATE TABLE "MarketplaceListingReport" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reason" "MarketplaceListingReportReason" NOT NULL,
    "description" TEXT,
    "status" "MarketplaceListingReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceListingReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketplaceListingReport_listingId_reporterId_key" ON "MarketplaceListingReport"("listingId", "reporterId");

-- CreateIndex
CREATE INDEX "MarketplaceListingReport_listingId_idx" ON "MarketplaceListingReport"("listingId");

-- CreateIndex
CREATE INDEX "MarketplaceListingReport_reporterId_idx" ON "MarketplaceListingReport"("reporterId");

-- CreateIndex
CREATE INDEX "MarketplaceListingReport_status_idx" ON "MarketplaceListingReport"("status");

-- CreateIndex
CREATE INDEX "MarketplaceListingReport_createdAt_idx" ON "MarketplaceListingReport"("createdAt");

-- AddForeignKey
ALTER TABLE "MarketplaceListingReport" ADD CONSTRAINT "MarketplaceListingReport_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "MarketplaceListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceListingReport" ADD CONSTRAINT "MarketplaceListingReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
