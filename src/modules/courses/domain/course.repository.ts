import { Prisma } from "../../../generated/prisma/client";
import { Course } from "./course";

export interface ICourseRepository {
  createCourse(data: Prisma.CourseUncheckedCreateInput): Promise<Course>;
}
