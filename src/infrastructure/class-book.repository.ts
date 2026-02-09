import { IClassBookRepository } from "../modules/class-book/domain/class-book.repository";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import {
  ClassBook,
  ClassBookQueryParams,
} from "../modules/class-book/domain/class-book";
import { calculatePagination } from "../core/utils/calculator";
import { AppError } from "../core/error/app-error";
import { ErrorCode } from "../core/types/errors";

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
    const {
      page = 1,
      pageSize = 10,
      orderBy = "createdAy",
      sortBy,
      searchBy,
      search,
      curriculumID,
    } = query;
    const classBooks = await this.prisma.classBook.findMany({
      skip: calculatePagination(page, pageSize),
      take: pageSize,
      orderBy: {
        [orderBy]: sortBy,
      },
      where: {
        ...(curriculumID && { curriculumID }),
        ...(search &&
          searchBy && {
            [searchBy]: {
              contains: search,
              mode: "insensitive",
            },
          }),
        deletedAt: null,
      },
    });
    return classBooks;
  }

  async getClassBookById(id: number): Promise<ClassBook | null> {
    try {
      const classBook = await this.prisma.classBook.findUnique({
        where: { id },
      });
      return classBook;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return null;
        }
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "Database error occurred",
        500,
      );
    }
  }
}
