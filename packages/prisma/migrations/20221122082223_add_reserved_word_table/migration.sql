-- CreateTable
CREATE TABLE "ReservedWords" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,

    CONSTRAINT "ReservedWords_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ReservedWords" ENABLE ROW LEVEL SECURITY;

-- CreateIndex
CREATE UNIQUE INDEX "ReservedWords_word_key" ON "ReservedWords"("word");
