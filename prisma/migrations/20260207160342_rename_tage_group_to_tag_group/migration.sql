/*
  Warnings:

  - You are about to drop the `tage_groups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_tageGroupsId_fkey";

-- DropTable
DROP TABLE "tage_groups";

-- CreateTable
CREATE TABLE "tag_groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tag_groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_groups_name_key" ON "tag_groups"("name");

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_tageGroupsId_fkey" FOREIGN KEY ("tageGroupsId") REFERENCES "tag_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
