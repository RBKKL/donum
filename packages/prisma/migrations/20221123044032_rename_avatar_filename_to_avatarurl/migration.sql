/*
  Warnings:

  - You are about to drop the column `avatarFilename` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "avatarFilename",
ADD COLUMN     "avatarUrl" TEXT;
