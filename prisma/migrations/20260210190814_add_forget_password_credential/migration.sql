/*
  Warnings:

  - Made the column `created_by` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_by" SET NOT NULL;

-- CreateTable
CREATE TABLE "forget_password_credentials" (
    "id" SERIAL NOT NULL,
    "reference" UUID NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL DEFAULT NOW() + INTERVAL '5 minutes',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "forget_password_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "forget_password_credentials_reference_key" ON "forget_password_credentials"("reference");
