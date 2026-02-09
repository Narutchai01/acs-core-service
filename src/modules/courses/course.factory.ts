import { CourseDTO, Course } from "./domain/course";
interface ICourseFactory {
  mapCourseToDTO(course: Course): CourseDTO;
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
}
