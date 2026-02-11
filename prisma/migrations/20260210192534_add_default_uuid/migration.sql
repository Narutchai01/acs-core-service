/*
  Warnings:

  - You are about to drop the column `reference` on the `forget_password_credentials` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reference_code]` on the table `forget_password_credentials` will be added. If there are existing duplicate values, this will fail.
  - The required column `reference_code` was added to the `forget_password_credentials` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "forget_password_credentials_reference_key";

-- AlterTable
ALTER TABLE "forget_password_credentials" DROP COLUMN "reference",
ADD COLUMN     "reference_code" UUID NOT NULL,
ALTER COLUMN "expired_at" SET DEFAULT NOW() + INTERVAL '5 minutes';

-- CreateIndex
CREATE UNIQUE INDEX "forget_password_credentials_reference_code_key" ON "forget_password_credentials"("reference_code");
