/*
  Warnings:

  - Added the required column `academicPositionId` to the `professors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "professors" ADD COLUMN     "academicPositionId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "academic_positions" (
    "id" SERIAL NOT NULL,
    "name_th" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "short_name_th" TEXT NOT NULL,
    "short_name_en" TEXT NOT NULL,

    CONSTRAINT "academic_positions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "academic_positions_name_th_key" ON "academic_positions"("name_th");

-- AddForeignKey
ALTER TABLE "professors" ADD CONSTRAINT "professors_academicPositionId_fkey" FOREIGN KEY ("academicPositionId") REFERENCES "academic_positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
