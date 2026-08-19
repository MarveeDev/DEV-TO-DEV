-- AlterTable
ALTER TABLE "DeveloperScore" ADD COLUMN     "dailyConnectionCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dailyPostCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastActivityDate" TIMESTAMP(3);
