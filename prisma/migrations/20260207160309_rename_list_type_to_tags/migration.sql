/*
  Warnings:

  - You are about to drop the `list_types` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "list_types" DROP CONSTRAINT "list_types_tageGroupsId_fkey";

-- DropTable
DROP TABLE "list_types";

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type_id" INTEGER NOT NULL,
    "tageGroupsId" INTEGER,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_tageGroupsId_fkey" FOREIGN KEY ("tageGroupsId") REFERENCES "tage_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
