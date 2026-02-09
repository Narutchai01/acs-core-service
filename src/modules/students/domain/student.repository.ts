import { Prisma } from "../../../generated/prisma/client";
import { Student, StudentQueryParams } from "./student";

export interface IStudentRepository {
  createStudent(data: Prisma.StudentCreateInput): Promise<Student>;
  getStudents(query: StudentQueryParams): Promise<Student[]>;
  getStudentById(id: number): Promise<Student | null>;
}
