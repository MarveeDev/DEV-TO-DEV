-- CreateTable
CREATE TABLE "BackgroundSound" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "duration" INTEGER,
    "category" TEXT,
    "coverImageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BackgroundSound_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Post" ADD COLUMN "backgroundSoundId" TEXT;

-- CreateIndex
CREATE INDEX "BackgroundSound_category_idx" ON "BackgroundSound"("category");

-- CreateIndex
CREATE INDEX "BackgroundSound_isActive_idx" ON "BackgroundSound"("isActive");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_backgroundSoundId_fkey" FOREIGN KEY ("backgroundSoundId") REFERENCES "BackgroundSound"("id") ON DELETE SET NULL ON UPDATE CASCADE;
