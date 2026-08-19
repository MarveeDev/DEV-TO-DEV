-- CreateEnum
CREATE TYPE "ProjectRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "ProjectJoinRequest" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "developerProfileId" TEXT NOT NULL,
    "status" "ProjectRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectJoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectJoinRequest_projectId_developerProfileId_key" ON "ProjectJoinRequest"("projectId", "developerProfileId");

-- AddForeignKey
ALTER TABLE "ProjectJoinRequest" ADD CONSTRAINT "ProjectJoinRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectJoinRequest" ADD CONSTRAINT "ProjectJoinRequest_developerProfileId_fkey" FOREIGN KEY ("developerProfileId") REFERENCES "DeveloperProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
