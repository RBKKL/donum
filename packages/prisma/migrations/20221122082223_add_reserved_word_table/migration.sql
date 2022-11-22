-- CreateTable
CREATE TABLE "ReservedWords" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,

    CONSTRAINT "ReservedWords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReservedWords_word_key" ON "ReservedWords"("word");
