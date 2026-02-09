/*
  Warnings:

  - You are about to drop the column `file_url` on the `curriculums` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `curriculums` table. All the data in the column will be lost.
  - Added the required column `document_url` to the `curriculums` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail_url` to the `curriculums` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "curriculums" DROP COLUMN "file_url",
DROP COLUMN "thumbnail",
ADD COLUMN     "document_url" TEXT NOT NULL,
ADD COLUMN     "thumbnail_url" TEXT NOT NULL;
