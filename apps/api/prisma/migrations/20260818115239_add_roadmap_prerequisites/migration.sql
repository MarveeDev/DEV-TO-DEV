-- CreateTable
CREATE TABLE "RoadmapNodePrerequisite" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "prerequisiteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoadmapNodePrerequisite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapNodePrerequisite_nodeId_prerequisiteId_key" ON "RoadmapNodePrerequisite"("nodeId", "prerequisiteId");

-- AddForeignKey
ALTER TABLE "RoadmapNodePrerequisite" ADD CONSTRAINT "RoadmapNodePrerequisite_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "RoadmapNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapNodePrerequisite" ADD CONSTRAINT "RoadmapNodePrerequisite_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "RoadmapNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
