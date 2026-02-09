/*
  Warnings:

  - You are about to drop the column `image` on the `class_books` table. All the data in the column will be lost.
  - Added the required column `thumbnail_url` to the `class_books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "class_books" DROP COLUMN "image",
ADD COLUMN     "thumbnail_url" TEXT NOT NULL;
