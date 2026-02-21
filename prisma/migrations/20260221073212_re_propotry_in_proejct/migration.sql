/*
  Warnings:

  - You are about to drop the column `detail` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `github` on the `projects` table. All the data in the column will be lost.
  - Added the required column `details` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "forget_password_credentials" ALTER COLUMN "expired_at" SET DEFAULT NOW() + INTERVAL '5 minutes';

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "detail",
DROP COLUMN "github",
ADD COLUMN     "details" TEXT NOT NULL,
ADD COLUMN     "github_url" TEXT;
