/*
  Warnings:

  - You are about to drop the column `levelId` on the `education` table. All the data in the column will be lost.
  - You are about to drop the column `professorId` on the `education` table. All the data in the column will be lost.
  - You are about to drop the column `university` on the `education` table. All the data in the column will be lost.
  - You are about to drop the `education_levels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "education" DROP CONSTRAINT "education_levelId_fkey";

-- DropForeignKey
ALTER TABLE "education" DROP CONSTRAINT "education_professorId_fkey";

-- AlterTable
ALTER TABLE "education" DROP COLUMN "levelId",
DROP COLUMN "professorId",
DROP COLUMN "university",
ADD COLUMN     "professorID" INTEGER;

-- DropTable
DROP TABLE "education_levels";

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_professorID_fkey" FOREIGN KEY ("professorID") REFERENCES "professors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
