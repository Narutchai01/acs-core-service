/*
  Warnings:

  - You are about to drop the column `professorID` on the `education` table. All the data in the column will be lost.
  - Added the required column `professor_id` to the `education` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "education" DROP CONSTRAINT "education_professorID_fkey";

-- AlterTable
ALTER TABLE "education" DROP COLUMN "professorID",
ADD COLUMN     "professor_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
