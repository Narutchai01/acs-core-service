import { PrismaClient, Prisma } from "../generated/prisma/client";
import { Student } from "../modules/students/domain./student";
import { IStudentRepository } from "../modules/students/domain./student.repository";
export class StudentRepository implements IStudentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createStudent(data: Prisma.StudentCreateInput): Promise<Student> {
    const student = await this.prisma.student.create({
      data,
      include: {
        user: true,
      },
    });
    return student;
  }
}
