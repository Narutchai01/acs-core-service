import { ICourseRepository } from "../modules/courses/domain/course.repository";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { Course, CourseQueryParams } from "../modules/courses/domain/course";
import { calculatePagination } from "../core/utils/calculator";
import { AppError } from "../core/error/app-error";
import { ErrorCode } from "../core/types/errors";

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
    const {
      page = 1,
      pageSize = 10,
      orderBy = "createdAt",
      sortBy,
      typeCourseID,
      curriculumID,
      search,
      searchBy,
    } = query;
    const courses = await this.prisma.course.findMany({
      skip: calculatePagination(page, pageSize),
      take: pageSize,
      orderBy: {
        [orderBy]: sortBy,
      },
      where: {
        ...(typeCourseID && { typeCourseID }),
        ...(curriculumID && { curriculumID }),
        ...(search &&
          searchBy &&
          typeof searchBy === "string" && {
            [searchBy]: {
              contains: search,
              mode: "insensitive",
            },
          }),
      },
      include: {
        typeCourse: true,
        curriculum: true,
      },
    });
    return courses as unknown as Course[];
  }

  async getCourseById(id: number): Promise<Course | null> {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id },
        include: {
          typeCourse: true,
          curriculum: true,
        },
      });
      return course as unknown as Course | null;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return null;
        }
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "Database error occurred while fetching course by ID",
        500,
      );
    }
  }
}
