import { IClassBookRepository } from "../modules/class-book/domain/class-book.repository";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import {
  ClassBook,
  ClassBookQueryParams,
} from "../modules/class-book/domain/class-book";
import { calculatePagination } from "../core/utils/calculator";

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

  async getClassBooks(query: ClassBookQueryParams): Promise<ClassBook[]> {
    const { page = 1, pageSize = 10, orderBy = "createdAy", sortBy } = query;
    const classBooks = await this.prisma.classBook.findMany({
      skip: calculatePagination(page, pageSize),
      take: pageSize,
      orderBy: {
        [orderBy]: sortBy,
      },
      where: {
        deletedAt: null,
      },
    });
    return classBooks;
  }
}
