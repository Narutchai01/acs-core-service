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
  constructor(private readonly prisma: PrismaClient) { }

  async createClassBook(
    data: Prisma.ClassBookUncheckedCreateInput,
  ): Promise<ClassBook> {
    const classBook = await this.prisma.classBook.create({
      data,
      include: {
        curriculum: true,
      },
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
      include: {
        curriculum: true,
      },
    });
    return classBooks;
  }

  async getClassBookById(id: number): Promise<ClassBook | null> {
    try {
      const classBook = await this.prisma.classBook.findUnique({
        where: { id, deletedAt: null },
        include: {
          curriculum: true,
        },
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
  async countClassBooks(query: ClassBookQueryParams): Promise<number> {
    const { searchBy, search, curriculumID } = query;
    const count = await this.prisma.classBook.count({
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
    return count;
  }

  async updateClassBook(classBookID: number, data: Prisma.ClassBookUncheckedUpdateInput
  ): Promise<ClassBook> {
    try {
      const classBook = await this.prisma.classBook.update({
        where: { id: classBookID },
        data,
        include: {
          curriculum: true,
        },
      });
      return classBook as ClassBook;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new AppError(
            ErrorCode.NOT_FOUND_ERROR,
            "ClassBook not found",
            404,
          );
        }
      }
      throw error;
    }
  }

  async deleteClassBook(id: number): Promise<ClassBook> {
    try {
      const classBook = await this.prisma.classBook.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
        include: {
          curriculum: true,
        },
      });
      return classBook as ClassBook;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new AppError(
            ErrorCode.NOT_FOUND_ERROR,
            "ClassBook not found",
            404,
          );
        }
      }
      throw error;
    }
  }
}
