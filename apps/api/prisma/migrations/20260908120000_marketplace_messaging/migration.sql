-- Add MESSAGE notification type for buyer/seller message notifications.
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'MESSAGE';

-- Associate a conversation with a marketplace listing (nullable: null for
-- connection-based chats, a listing id for marketplace chats).
ALTER TABLE "Conversation" ADD COLUMN "listingId" TEXT;

-- FK to MarketplaceListing. ON DELETE SET NULL so conversations survive
-- listing deletion (the listing context simply becomes unavailable).
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_listingId_fkey"
  FOREIGN KEY ("listingId") REFERENCES "MarketplaceListing"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Replace the pair-only unique index with per-listing uniqueness:
--   * connection chats  (listingId IS NULL)     -> unique per user pair
--   * marketplace chats (listingId IS NOT NULL) -> unique per (pair, listing)
DROP INDEX "Conversation_userAId_userBId_key";
CREATE UNIQUE INDEX "Conversation_userAId_userBId_key"
  ON "Conversation"("userAId", "userBId") WHERE "listingId" IS NULL;
CREATE UNIQUE INDEX "Conversation_userAId_userBId_listingId_key"
  ON "Conversation"("userAId", "userBId", "listingId") WHERE "listingId" IS NOT NULL;
