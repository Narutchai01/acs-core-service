import { ClassBook } from "./class-book";
import { Prisma } from "../../../generated/prisma/client";

export interface IClassBookRepository {
  createClassBook(
    data: Prisma.ClassBookUncheckedCreateInput,
  ): Promise<ClassBook>;
}
