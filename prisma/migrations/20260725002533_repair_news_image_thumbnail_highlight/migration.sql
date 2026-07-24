-- Keep the password credential default consistent when the failed migration
-- has to be marked as applied before this repair is deployed.
ALTER TABLE "forget_password_credentials"
ALTER COLUMN "expired_at" SET DEFAULT NOW() + INTERVAL '5 minutes';

-- Support both database states:
-- 1. The original migration failed, so image still exists.
-- 2. The original migration succeeded, so thumbnail and highlight exist.
ALTER TABLE "news"
ADD COLUMN IF NOT EXISTS "image" TEXT,
ADD COLUMN IF NOT EXISTS "highlight" TEXT,
ADD COLUMN IF NOT EXISTS "thumbnail" TEXT;

-- The original migration treated thumbnail as the replacement for image.
-- Preserve that value when restoring image on databases where it was dropped.
UPDATE "news"
SET "image" = "thumbnail"
WHERE "image" IS NULL
  AND "thumbnail" IS NOT NULL;

ALTER TABLE "news"
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "highlight" DROP NOT NULL,
ALTER COLUMN "thumbnail" DROP NOT NULL;
