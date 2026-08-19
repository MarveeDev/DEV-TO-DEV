-- CreateTable
CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "estimatedHours" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapNode" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "estimatedHours" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoadmapNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapNodeSkill" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoadmapNodeSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapProgress" (
    "id" TEXT NOT NULL,
    "developerProfileId" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoadmapProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Roadmap_slug_key" ON "Roadmap"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapNodeSkill_nodeId_skillId_key" ON "RoadmapNodeSkill"("nodeId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapProgress_developerProfileId_nodeId_key" ON "RoadmapProgress"("developerProfileId", "nodeId");

-- AddForeignKey
ALTER TABLE "RoadmapNode" ADD CONSTRAINT "RoadmapNode_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapNodeSkill" ADD CONSTRAINT "RoadmapNodeSkill_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "RoadmapNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapNodeSkill" ADD CONSTRAINT "RoadmapNodeSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapProgress" ADD CONSTRAINT "RoadmapProgress_developerProfileId_fkey" FOREIGN KEY ("developerProfileId") REFERENCES "DeveloperProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapProgress" ADD CONSTRAINT "RoadmapProgress_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapProgress" ADD CONSTRAINT "RoadmapProgress_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "RoadmapNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
