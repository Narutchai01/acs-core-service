/*
  Warnings:

  - You are about to drop the column `tageGroupsId` on the `tags` table. All the data in the column will be lost.
  - You are about to drop the column `type_id` on the `tags` table. All the data in the column will be lost.
  - Added the required column `tage_groups_id` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_tageGroupsId_fkey";

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "tageGroupsId",
DROP COLUMN "type_id",
ADD COLUMN     "tage_groups_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_tage_groups_id_fkey" FOREIGN KEY ("tage_groups_id") REFERENCES "tag_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
