-- AlterTable
ALTER TABLE "forget_password_credentials" ALTER COLUMN "expired_at" SET DEFAULT NOW() + INTERVAL '5 minutes';

-- CreateTable
CREATE TABLE "news_features" (
    "id" SERIAL NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "news_id" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "news_features_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_features_news_id_type_id_key" ON "news_features"("news_id", "type_id");

-- AddForeignKey
ALTER TABLE "news_features" ADD CONSTRAINT "news_features_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "news"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_features" ADD CONSTRAINT "news_features_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
