-- CreateEnum
CREATE TYPE "LessonBlockType" AS ENUM ('EXPLANATION', 'SYNTAX', 'EXAMPLES', 'PRACTICE', 'QUIZ', 'KEY_TAKEAWAYS');

-- CreateTable
CREATE TABLE "LessonBlock" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "type" "LessonBlockType" NOT NULL,
    "content" JSONB NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LessonBlock_nodeId_order_idx" ON "LessonBlock"("nodeId", "order");

-- AddForeignKey
ALTER TABLE "LessonBlock" ADD CONSTRAINT "LessonBlock_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "RoadmapNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
