import { IClassBookRepository } from "../modules/class-book/domain/class-book.repository";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { ClassBook } from "../modules/class-book/domain/class-book";

export class ClassBookRepository implements IClassBookRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createClassBook(
    data: Prisma.ClassBookUncheckedCreateInput,
  ): Promise<ClassBook> {
    const classBook = await this.prisma.classBook.create({
      data,
    });
    return classBook;
  }
}
