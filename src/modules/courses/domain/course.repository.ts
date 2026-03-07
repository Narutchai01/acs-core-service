import { Prisma } from "../../../generated/prisma/client";
import { Course, CourseQueryParams } from "./course";

export interface ICourseRepository {
  createCourse(data: Prisma.CourseUncheckedCreateInput): Promise<Course>;
  getCoures(query: CourseQueryParams): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | null>;
  countCourse(query: CourseQueryParams): Promise<number>;
  updateCourse(
    courseId: number,
    data: Prisma.CourseUncheckedUpdateInput
  ): Promise<Course | null>
  deleteCourse(courseId:number, updatedBy: number):Promise<Course | null>
}
