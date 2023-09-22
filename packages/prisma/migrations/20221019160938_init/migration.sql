-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;