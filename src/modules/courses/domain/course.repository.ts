import { Course, CourseQueryParams, CourseCreatePayload, CourseUpdatePayload } from "./course";

export interface ICourseRepository {
  createCourse(data: CourseCreatePayload, preCourseID: number[]): Promise<Course>;
  getCoures(query: CourseQueryParams): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | null>;
  countCourse(query: CourseQueryParams): Promise<number>;
  updateCourse(
    courseId: number,
    data: CourseUpdatePayload,
    newPrecourseId: number[],
    deletePrecourseId: number[]
  ): Promise<Course | null>;
  deleteCourse(courseId: number, updatedBy: number): Promise<Course | null>;
  getCourseCodes(codes: string[]): Promise<string[]>;
  createManyCourses(data: CourseCreatePayload[]): Promise<void>;
}
