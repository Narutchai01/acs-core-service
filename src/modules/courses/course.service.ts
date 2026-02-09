import { CreateCourseDTO, CourseDTO } from "./domain/course";
import { ICourseRepository } from "../courses/domain/course.repository";

interface ICourseService {
  createCourse(data: CreateCourseDTO): Promise<CourseDTO>;
}

export class CourseService implements ICourseService {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async createCourse(data: CreateCourseDTO): Promise<CourseDTO> {
    const course = await this.courseRepository.createCourse({
      ...data,
      createdBy: 0,
      updatedBy: 0,
    });
    return course as CourseDTO;
  }
}
