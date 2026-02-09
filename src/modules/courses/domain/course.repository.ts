import { Prisma } from "../../../generated/prisma/client";
import { Course, CourseQueryParams } from "./course";

export interface ICourseRepository {
  createCourse(data: Prisma.CourseUncheckedCreateInput): Promise<Course>;
  getCoures(query: CourseQueryParams): Promise<Course[]>;
}
