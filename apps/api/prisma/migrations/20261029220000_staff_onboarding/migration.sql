-- AlterTable
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;

-- AlterTable
ALTER TABLE "AdminInvite" ADD COLUMN "name" TEXT;
ALTER TABLE "AdminInvite" ADD COLUMN "tokenHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AdminInvite_tokenHash_key" ON "AdminInvite"("tokenHash");
