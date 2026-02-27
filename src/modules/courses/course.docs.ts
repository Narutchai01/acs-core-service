import { mapResponse } from "../../core/interceptor/response";
import { Pageable } from "../../core/models";
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
      200: mapResponse(Pageable(CourseDTO)),
    },
  },
  getCourseById: {
    detail: {
      summary: "Get course by ID",
      description: "This endpoint retrieves a course by its ID.",
      tags: ["Courses"],
    },
    params: t.Object({
        id: t.Number(),
    }),
    response: {
      200: mapResponse(CourseDTO),
      404: mapResponse(t.Null()),
    },
  },
  DeleteCourse:{
     detail: {
      summary: "Delete course",
      description: "Delete a course by ID",
      tags: ["Courses"],
    },
    params: t.Object({
        id: t.Number(),
    }),
    response: {
      200: mapResponse(CourseDTO),
      404: mapResponse(t.Null()),
    },
  },
};
