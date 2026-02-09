/*
  Warnings:

  - Added the required column `classbook_id` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "classbook_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classbook_id_fkey" FOREIGN KEY ("classbook_id") REFERENCES "class_books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
