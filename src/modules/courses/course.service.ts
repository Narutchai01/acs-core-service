import { CreateCourseDTO, CourseDTO, CourseQueryParams } from "./domain/course";
import { ICourseRepository } from "../courses/domain/course.repository";
import { ICourseFactory } from "./course.factory";
import { PageableType } from "../../core/models";
interface ICourseService {
  createCourse(data: CreateCourseDTO): Promise<CourseDTO>;
  getCourses(query: CourseQueryParams): Promise<PageableType<typeof CourseDTO>>;
  getCourseByID(id: number): Promise<CourseDTO | null>;
}

export class CourseService implements ICourseService {
  constructor(
    private readonly courseRepository: ICourseRepository,
    private readonly courseFactory: ICourseFactory,
  ) {}

  async createCourse(data: CreateCourseDTO): Promise<CourseDTO> {
    const course = await this.courseRepository.createCourse({
      ...data,
      createdBy: 0,
      updatedBy: 0,
    });
    return this.courseFactory.mapCourseToDTO(course);
  }

  async getCourses(
    query: CourseQueryParams,
  ): Promise<PageableType<typeof CourseDTO>> {
    const [courses, total] = await Promise.all([
      this.courseRepository.getCoures(query),
      this.courseRepository.countCourse(query),
    ]);

    return {
      rows: this.courseFactory.mapCourseListToDTO(courses),
      totalRecords: total,
      page: query.page || 1,
      pageSize: query.pageSize || 10,
    };
  }

  async getCourseByID(id: number): Promise<CourseDTO | null> {
    const course = await this.courseRepository.getCourseById(id);
    if (!course) {
      return null;
    }
    return this.courseFactory.mapCourseToDTO(course);
  }

  async deleteCourse(courseId: number, updatedBy: number): Promise<CourseDTO | null>{
    const course = await this.courseRepository.deleteCourse(
              courseId,
              updatedBy || 0,
            );
      if (!course) return null;

      return this.courseFactory.mapCourseToDTO(course);
  }
}
