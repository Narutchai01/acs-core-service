-- CreateTable
CREATE TABLE "class_books" (
    "id" SERIAL NOT NULL,
    "classof" INTEGER NOT NULL,
    "first_year_academic" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "curriculum_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "class_books_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "class_books_classof_key" ON "class_books"("classof");

-- AddForeignKey
ALTER TABLE "class_books" ADD CONSTRAINT "class_books_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "curriculums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
