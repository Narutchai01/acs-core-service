/*
  Warnings:

  - You are about to drop the column `tech_stack` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "forget_password_credentials" ALTER COLUMN "expired_at" SET DEFAULT NOW() + INTERVAL '5 minutes';

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "tech_stack",
ADD COLUMN     "tech_stacks" TEXT;
