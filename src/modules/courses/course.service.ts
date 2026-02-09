import { CreateCourseDTO, CourseDTO, CourseQueryParams } from "./domain/course";
import { ICourseRepository } from "../courses/domain/course.repository";
import { ICourseFactory } from "./course.factory";

interface ICourseService {
  createCourse(data: CreateCourseDTO): Promise<CourseDTO>;
  getCourses(query: CourseQueryParams): Promise<CourseDTO[]>;
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

  async getCourses(query: CourseQueryParams): Promise<CourseDTO[]> {
    const courses = await this.courseRepository.getCoures(query);
    return this.courseFactory.mapCourseListToDTO(courses);
  }

  async getCourseByID(id: number): Promise<CourseDTO | null> {
    const course = await this.courseRepository.getCourseById(id);
    if (!course) {
      return null;
    }
    return this.courseFactory.mapCourseToDTO(course);
  }
}
