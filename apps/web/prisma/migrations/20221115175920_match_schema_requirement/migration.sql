/*
  Warnings:

  - A unique constraint covering the columns `[nickname]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "avatarFilename" TEXT,
ADD COLUMN     "minShowAmount" DECIMAL(78,0) NOT NULL DEFAULT 1000000000000000,
ALTER COLUMN "nickname" DROP NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Profile_nickname_key" ON "Profile"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_address_key" ON "Profile"("address");
