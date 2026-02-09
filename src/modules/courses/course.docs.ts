import { mapResponse } from "../../core/interceptor/response";
import { CourseDTO, CreateCourseDTO } from "./domain/course";

export const CourseDocs = {
  creteCourse: {
    detail: {
      summary: "Create a new course",
      description:
        "This endpoint allows you to create a new course in the system. You need to provide the course details in the request body.",
      tags: ["Courses"],
    },
    body: CreateCourseDTO,
    response: {
      201: mapResponse(CourseDTO),
    },
  },
};
