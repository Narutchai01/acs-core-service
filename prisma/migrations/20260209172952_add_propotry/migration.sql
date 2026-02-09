/*
  Warnings:

  - You are about to drop the column `level_en` on the `education_levels` table. All the data in the column will be lost.
  - You are about to drop the column `level_th` on the `education_levels` table. All the data in the column will be lost.
  - Added the required column `name_en` to the `education_levels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_th` to the `education_levels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "education_levels" DROP COLUMN "level_en",
DROP COLUMN "level_th",
ADD COLUMN     "name_en" TEXT NOT NULL,
ADD COLUMN     "name_th" TEXT NOT NULL,
ADD COLUMN     "short_name_en" TEXT,
ADD COLUMN     "short_name_th" TEXT;
