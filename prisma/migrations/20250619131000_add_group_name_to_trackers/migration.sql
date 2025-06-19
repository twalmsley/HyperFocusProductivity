/*
  Warnings:

  - Added the required column `groupName` to the `Tracker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- First add the column as nullable
ALTER TABLE "Tracker" ADD COLUMN "groupName" TEXT;

-- Set default value for existing records
UPDATE "Tracker" SET "groupName" = 'Default' WHERE "groupName" IS NULL;

-- Make the column required
ALTER TABLE "Tracker" ALTER COLUMN "groupName" SET NOT NULL;
