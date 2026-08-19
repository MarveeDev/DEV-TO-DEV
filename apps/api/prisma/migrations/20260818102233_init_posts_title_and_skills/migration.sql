-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Untitled Post';

-- CreateTable
CREATE TABLE "PostSkill" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostSkill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostSkill_postId_skillId_key" ON "PostSkill"("postId", "skillId");

-- AddForeignKey
ALTER TABLE "PostSkill" ADD CONSTRAINT "PostSkill_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostSkill" ADD CONSTRAINT "PostSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
