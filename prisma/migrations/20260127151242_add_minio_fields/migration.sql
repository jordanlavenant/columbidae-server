/*
  Warnings:

  - Added the required column `fileName` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL;
