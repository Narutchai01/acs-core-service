-- AlterTable
ALTER TABLE "forget_password_credentials" ALTER COLUMN "expired_at" SET DEFAULT NOW() + INTERVAL '5 minutes';

-- CreateTable
CREATE TABLE "pre_courses" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "pre_course_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pre_courses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pre_courses_course_id_pre_course_id_key" ON "pre_courses"("course_id", "pre_course_id");

-- AddForeignKey
ALTER TABLE "pre_courses" ADD CONSTRAINT "pre_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_courses" ADD CONSTRAINT "pre_courses_pre_course_id_fkey" FOREIGN KEY ("pre_course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
