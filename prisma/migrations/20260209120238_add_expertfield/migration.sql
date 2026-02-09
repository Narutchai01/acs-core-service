/*
  Warnings:

  - Added the required column `expert_fields` to the `professors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "professors" ADD COLUMN     "expert_fields" TEXT NOT NULL;
