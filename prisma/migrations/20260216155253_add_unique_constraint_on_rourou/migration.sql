/*
  Warnings:

  - A unique constraint covering the columns `[authorId,postId]` on the table `Rourou` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rourou_authorId_postId_key" ON "Rourou"("authorId", "postId");
