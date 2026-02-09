/*
  Warnings:

  - You are about to drop the `education` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `educations` to the `professors` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "education" DROP CONSTRAINT "education_professor_id_fkey";

-- AlterTable
ALTER TABLE "professors" ADD COLUMN     "educations" TEXT NOT NULL;

-- DropTable
DROP TABLE "education";
