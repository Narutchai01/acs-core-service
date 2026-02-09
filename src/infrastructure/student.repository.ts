import { PrismaClient, Prisma } from "../generated/prisma/client";
import {
  Student,
  StudentQueryParams,
} from "../modules/students/domain/student";
import { IStudentRepository } from "../modules/students/domain/student.repository";
import { calculatePagination } from "../core/utils/calculator";
import { AppError } from "../core/error/app-error";
import { ErrorCode } from "../core/types/errors";
export class StudentRepository implements IStudentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createStudent(
    data: Prisma.StudentUncheckedCreateInput,
  ): Promise<Student> {
    const student = await this.prisma.student.create({
      data,
      include: {
        user: true,
      },
    });
    return student as Student;
  }

  async getStudents(query: StudentQueryParams): Promise<Student[]> {
    const { page = 1, pageSize = 10, orderBy = "createdAt", sortBy } = query;
    const students = await this.prisma.student.findMany({
      skip: calculatePagination(page, pageSize),
      take: pageSize,
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
      const student = await this.prisma.student.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });
      return student as Student | null;
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
}
