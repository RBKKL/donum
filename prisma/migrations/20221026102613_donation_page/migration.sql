-- CreateTable
CREATE TABLE "DonationPage" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "DonationPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DonationPage_address_key" ON "DonationPage"("address");
