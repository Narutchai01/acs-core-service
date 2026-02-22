/*
  Warnings:

  - You are about to drop the column `type_id` on the `news_features` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[news_id,tag_id]` on the table `news_features` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tag_id` to the `news_features` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "news_features" DROP CONSTRAINT "news_features_type_id_fkey";

-- DropIndex
DROP INDEX "news_features_news_id_type_id_key";

-- AlterTable
ALTER TABLE "forget_password_credentials" ALTER COLUMN "expired_at" SET DEFAULT NOW() + INTERVAL '5 minutes';

-- AlterTable
ALTER TABLE "news_features" DROP COLUMN "type_id",
ADD COLUMN     "tag_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "news_features_news_id_tag_id_key" ON "news_features"("news_id", "tag_id");

-- AddForeignKey
ALTER TABLE "news_features" ADD CONSTRAINT "news_features_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
