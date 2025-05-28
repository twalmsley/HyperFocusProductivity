/*
  Warnings:

  - You are about to drop the column `cancelAtPeriodEnd` on the `UserSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `currentPeriodEnd` on the `UserSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `currentPeriodStart` on the `UserSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `UserSubscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserSubscription" DROP COLUMN "cancelAtPeriodEnd",
DROP COLUMN "currentPeriodEnd",
DROP COLUMN "currentPeriodStart",
DROP COLUMN "stripeSubscriptionId";
