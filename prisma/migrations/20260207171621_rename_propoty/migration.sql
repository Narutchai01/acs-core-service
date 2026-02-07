/*
  Warnings:

  - You are about to drop the column `tags_id` on the `news` table. All the data in the column will be lost.
  - Added the required column `tag_id` to the `news` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "news" DROP CONSTRAINT "news_tags_id_fkey";

-- AlterTable
ALTER TABLE "news" DROP COLUMN "tags_id",
ADD COLUMN     "tag_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
