import { Prisma } from "../../../generated/prisma/client";
import { Student } from "./student";

export interface IStudentRepository {
  createStudent(data: Prisma.StudentCreateInput): Promise<Student>;
}
