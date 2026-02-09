import { ClassBook, ClassBookQueryParams } from "./class-book";
import { Prisma } from "../../../generated/prisma/client";

export interface IClassBookRepository {
  createClassBook(
    data: Prisma.ClassBookUncheckedCreateInput,
  ): Promise<ClassBook>;
  getClassBooks(query: ClassBookQueryParams): Promise<ClassBook[]>;
  getClassBookById(id: number): Promise<ClassBook | null>;
}
