import { CourseDTO, Course } from "./domain/course";
export interface ICourseFactory {
  mapCourseToDTO(course: Course): CourseDTO;
  mapCourseListToDTO(courses: Course[]): CourseDTO[];
}

export class CourseFactory implements ICourseFactory {
  mapCourseToDTO(course: Course): CourseDTO {
    return {
      id: course.id,
      courseCode: course.courseCode,
      courseNameTh: course.courseNameTh,
      courseNameEn: course.courseNameEn,
      credits: course.credits,
      detail: course.detail,
      typeCourse: course.typeCourse,
      curriculum: course.curriculum,
    };
  }

  mapCourseListToDTO(courses: Course[]): CourseDTO[] {
    return courses.map((course) => this.mapCourseToDTO(course));
  }
}
