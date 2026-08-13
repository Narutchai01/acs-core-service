import { CourseDTO, Course, BatchCourseResponseDTO } from "./domain/course";
export interface ICourseFactory {
  mapCourseToDTO(course: Course): CourseDTO;
  mapCourseListToDTO(courses: Course[]): CourseDTO[];
  mapBatchCourseResponse(total: number, successful: number, failed: { row: number; reason: string }[], duplicates: string[]): BatchCourseResponseDTO;
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

  mapBatchCourseResponse(total: number, successful: number, failed: { row: number; reason: string }[], duplicates: string[]): BatchCourseResponseDTO {
    return {
      totalRecords: total,
      successfulRecords: successful,
      failedRecords: failed,
      duplicateRecords: duplicates,
    };
  }
}
