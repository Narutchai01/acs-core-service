/*
  Warnings:

  - You are about to drop the column `academicPositionId` on the `professors` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "professors" DROP CONSTRAINT "professors_academicPositionId_fkey";

-- AlterTable
ALTER TABLE "professors" DROP COLUMN "academicPositionId";

-- AddForeignKey
ALTER TABLE "professors" ADD CONSTRAINT "professors_academic_position_id_fkey" FOREIGN KEY ("academic_position_id") REFERENCES "academic_positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
