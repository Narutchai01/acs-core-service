-- CreateTable
CREATE TABLE "tage_groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tage_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type_id" INTEGER NOT NULL,
    "tageGroupsId" INTEGER,

    CONSTRAINT "list_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tage_groups_name_key" ON "tage_groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "list_types_name_key" ON "list_types"("name");

-- AddForeignKey
ALTER TABLE "list_types" ADD CONSTRAINT "list_types_tageGroupsId_fkey" FOREIGN KEY ("tageGroupsId") REFERENCES "tage_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
