-- AlterEnum
BEGIN;
CREATE TYPE "LessonBlockType_new" AS ENUM ('EXPLANATION', 'SYNTAX', 'EXAMPLE', 'TRY_IT', 'EXERCISE', 'QUIZ', 'KEY_TAKEAWAYS', 'NOTE');
ALTER TABLE "LessonBlock" ALTER COLUMN "type" TYPE "LessonBlockType_new" USING ("type"::text::"LessonBlockType_new");
ALTER TYPE "LessonBlockType" RENAME TO "LessonBlockType_old";
ALTER TYPE "LessonBlockType_new" RENAME TO "LessonBlockType";
DROP TYPE "LessonBlockType_old";
COMMIT;
