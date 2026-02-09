import { ICourseRepository } from "../modules/courses/domain/course.repository";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { Course } from "../modules/courses/domain/course";

export class CourseRepository implements ICourseRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createCourse(data: Prisma.CourseUncheckedCreateInput): Promise<Course> {
    try {
      const course = await this.prisma.course.create({
        data,
        include: {
          typeCourse: true,
          curriculum: true,
        },
      });
      return course as unknown as Course;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
