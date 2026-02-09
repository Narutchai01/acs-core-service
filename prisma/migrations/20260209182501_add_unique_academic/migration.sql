/*
  Warnings:

  - A unique constraint covering the columns `[sequence]` on the table `academic_positions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "academic_positions_sequence_key" ON "academic_positions"("sequence");
