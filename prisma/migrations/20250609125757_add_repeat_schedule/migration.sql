-- CreateEnum
CREATE TYPE "RepeatType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY', 'MONTHLY_BY_WEEKDAY');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "isTemplate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "repeatDay" INTEGER,
ADD COLUMN     "repeatDayOfWeek" INTEGER,
ADD COLUMN     "repeatDays" TEXT,
ADD COLUMN     "repeatInterval" INTEGER,
ADD COLUMN     "repeatMonth" INTEGER,
ADD COLUMN     "repeatType" "RepeatType",
ADD COLUMN     "repeatWeekOfMonth" INTEGER,
ADD COLUMN     "templateTaskId" TEXT;
