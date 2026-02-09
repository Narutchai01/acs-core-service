import { PrismaClient, Prisma } from "../generated/prisma/client";
import {
  Student,
  StudentQueryParams,
} from "../modules/students/domain/student";
import { IStudentRepository } from "../modules/students/domain/student.repository";
import { calculatePagination } from "../core/utils/calculator";
export class StudentRepository implements IStudentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createStudent(data: Prisma.StudentCreateInput): Promise<Student> {
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
}
