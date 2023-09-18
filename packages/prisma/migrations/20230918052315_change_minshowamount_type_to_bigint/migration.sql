/*
  Warnings:

  - You are about to alter the column `minShowAmount` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(78,0)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "notificationDuration" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "notificationImageUrl" TEXT,
ADD COLUMN     "notificationSoundUrl" TEXT,
ALTER COLUMN "minShowAmount" SET DEFAULT 1000000000000000,
ALTER COLUMN "minShowAmount" SET DATA TYPE BIGINT;
