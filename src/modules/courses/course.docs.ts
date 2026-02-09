import { mapResponse } from "../../core/interceptor/response";
import { CourseDTO, CourseQueryParams, CreateCourseDTO } from "./domain/course";
import { t } from "elysia";

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
  getCourses: {
    detail: {
      summary: "Get list of courses",
      description: "This endpoint retrieves a list of courses.",
      tags: ["Courses"],
    },
    query: CourseQueryParams,
    response: {
      200: mapResponse(t.Array(CourseDTO)),
    },
  },
  getCourseById: {
    detail: {
      summary: "Get course by ID",
      description: "This endpoint retrieves a course by its ID.",
      tags: ["Courses"],
    },
    response: {
      200: mapResponse(CourseDTO),
      404: mapResponse(t.Null()),
    },
  },
};
