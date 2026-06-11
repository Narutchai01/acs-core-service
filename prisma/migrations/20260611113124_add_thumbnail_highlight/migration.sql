/*
  Warnings:

  - You are about to drop the column `image` on the `news` table. All the data in the column will be lost.
  - Added the required column `highlight` to the `news` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `news` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "forget_password_credentials" ALTER COLUMN "expired_at" SET DEFAULT NOW() + INTERVAL '5 minutes';

-- AlterTable
ALTER TABLE "news" DROP COLUMN "image",
ADD COLUMN     "highlight" TEXT NOT NULL,
ADD COLUMN     "thumbnail" TEXT NOT NULL;
