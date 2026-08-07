import { Prisma } from "../generated/prisma/client";
import {
  Student,
  StudentQueryParams,
  StudentCreatePayload,
  StudentUpdatePayload,
} from "../modules/students/domain/student";
import { IStudentRepository } from "../modules/students/domain/student.repository";
import { calculatePagination } from "../core/utils/calculator";
import { AppError } from "../core/error/app-error";
import { ErrorCode } from "../core/types/errors";
import { PrismaInstance } from "../lib/db";
export class StudentRepository implements IStudentRepository {
  constructor(private readonly db: PrismaInstance) {}

  async createStudent(data: StudentCreatePayload): Promise<Student> {
    const student = await this.db.student.create({
      data: {
        ...data,
        createdBy: data.createdBy ?? 0,
        updatedBy: data.updatedBy ?? 0,
      },
      include: {
        user: true,
      },
    });
    return student as Student;
  }

  async getStudents(query: StudentQueryParams): Promise<Student[]> {
    const {
      page = 1,
      pageSize = 10,
      orderBy = "createdAt",
      sortBy,
      search,
      classBookID,
    } = query;

    const students = await this.db.student.findMany({
      skip: calculatePagination(page, pageSize),
      take: pageSize,
      where: {
        ...(classBookID && { classBookID }),
        deletedAt: null,
        ...(search && {
          OR: [
            {
              studentCode: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              user: {
                firstNameTh: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          ],
        }),
      },
      orderBy: {
        [orderBy]: sortBy,
      },
      include: {
        user: true,
      },
    });
    return students as Student[];
  }

  async getStudentById(id: number): Promise<Student | null> {
    try {
      const student = await this.db.student.findUnique({
        where: { id, deletedAt: null },
        include: {
          user: true,
        },
      });
      return student as Student | null;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return null;
        }
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "An error occurred while fetching the student",
        500,
      );
    }
  }

  async getStudentByUserId(userId: number): Promise<Student | null> {
    try {
      const student = await this.db.student.findFirst({
        where: { user: { id: userId, deletedAt: null }, deletedAt: null },
        include: {
          user: true,
          classBook: true,
        },
      });
      return student as Student | null;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return null;
        }
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "An error occurred while fetching the student",
        500,
      );
    }
  }

  async getStudentCodes(codes: string[]): Promise<string[]> {
    const students = await this.db.student.findMany({
      where: {
        studentCode: { in: codes },
        deletedAt: null,
      },
      select: { studentCode: true },
    });
    return students.map((s) => s.studentCode);
  }

  async deleteStudent(id: number): Promise<Student> {
    try {
      const student = await this.db.student.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
        include: {
          user: true,
        },
      });
      return student as Student;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new AppError(
            ErrorCode.NOT_FOUND_ERROR,
            "Student not found",
            404,
          );
        }
      }
      throw error;
    }
  }

  async updateStudent(
    studentID: number,
    data: StudentUpdatePayload,
  ): Promise<Student> {
    try {
      const student = await this.db.student.update({
        where: { id: studentID },
        data,
        include: {
          user: true,
        },
      });
      return student as Student;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new AppError(
            ErrorCode.NOT_FOUND_ERROR,
            "Student not found",
            404,
          );
        }
      }
      throw error;
    }
  }

  async countStudents(query: StudentQueryParams): Promise<number> {
    const count = await this.db.student.count({
      where: {
        ...(query.classBookID && { classBookID: query.classBookID }),
        deletedAt: null,
        ...(query.search && {
          OR: [
            {
              studentCode: {
                contains: query.search,
                mode: "insensitive",
              },
            },
            {
              user: {
                firstNameTh: {
                  contains: query.search,
                  mode: "insensitive",
                },
              },
            },
          ],
        }),
      },
    });
    return count;
  }
}
