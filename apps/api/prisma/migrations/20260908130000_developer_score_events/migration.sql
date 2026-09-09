-- CreateEnum
CREATE TYPE "ScoreEventType" AS ENUM ('POST_CREATED', 'POST_COMMENTED', 'POST_RECEIVED_COMMENT', 'POST_LIKED', 'QUESTION_CREATED', 'QUESTION_RECEIVED_ANSWER', 'QUESTION_UPVOTED', 'ANSWER_CREATED', 'ANSWER_UPVOTED', 'ANSWER_ACCEPTED', 'PROJECT_CREATED', 'PROJECT_RECEIVED_CONTRIBUTOR', 'CONNECTION_ACCEPTED', 'ROADMAP_NODE_COMPLETED', 'ROADMAP_COMPLETED');

-- CreateTable
CREATE TABLE "DeveloperScoreEvent" (
    "id" TEXT NOT NULL,
    "developerProfileId" TEXT NOT NULL,
    "type" "ScoreEventType" NOT NULL,
    "points" INTEGER NOT NULL,
    "referenceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeveloperScoreEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeveloperScoreEvent_developerProfileId_type_referenceId_key" ON "DeveloperScoreEvent"("developerProfileId", "type", "referenceId");

-- CreateIndex
CREATE INDEX "DeveloperScoreEvent_developerProfileId_idx" ON "DeveloperScoreEvent"("developerProfileId");

-- AddForeignKey
ALTER TABLE "DeveloperScoreEvent" ADD CONSTRAINT "DeveloperScoreEvent_developerProfileId_fkey" FOREIGN KEY ("developerProfileId") REFERENCES "DeveloperProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
