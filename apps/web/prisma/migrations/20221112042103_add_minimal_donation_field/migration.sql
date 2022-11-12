/*
  Warnings:

  - A unique constraint covering the columns `[nickname]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "avatarFilename" TEXT,
ADD COLUMN     "minimalDonation" DECIMAL(65,30) NOT NULL DEFAULT 0.001;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_nickname_key" ON "Profile"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_address_key" ON "Profile"("address");
