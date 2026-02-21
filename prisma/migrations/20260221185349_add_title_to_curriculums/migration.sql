/*
  Warnings:

  - Added the required column `title` to the `curriculums` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "curriculums" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "forget_password_credentials" ALTER COLUMN "expired_at" SET DEFAULT NOW() + INTERVAL '5 minutes';
