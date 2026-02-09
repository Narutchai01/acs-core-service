import { ICourseRepository } from "../modules/courses/domain/course.repository";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { Course, CourseQueryParams } from "../modules/courses/domain/course";
import { calculatePagination } from "../core/utils/calculator";

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

  async getCoures(query: CourseQueryParams): Promise<Course[]> {
    const { page = 1, pageSize = 10, orderBy = "createdAt", sortBy } = query;
    const courses = await this.prisma.course.findMany({
      skip: calculatePagination(page, pageSize),
      take: pageSize,
      orderBy: {
        [orderBy]: sortBy,
      },
      include: {
        typeCourse: true,
        curriculum: true,
      },
    });
    return courses as unknown as Course[];
  }
}
