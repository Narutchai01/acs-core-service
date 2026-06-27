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
      prerequisites:
        course.preCourses?.map((preCourse) => ({
          id: preCourse.prerequisite.id,
          courseCode: preCourse.prerequisite.courseCode,
          courseNameTh: preCourse.prerequisite.courseNameTh,
          courseNameEn: preCourse.prerequisite.courseNameEn,
          credits: preCourse.prerequisite.credits,
          detail: preCourse.prerequisite.detail,
        })) ?? [],
    };
  }

  mapCourseListToDTO(courses: Course[]): CourseDTO[] {
    return courses.map((course) => this.mapCourseToDTO(course));
  }
}
