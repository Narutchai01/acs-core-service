import {
  CreateStudentDTO,
  StudentDTO,
  StudentQueryParams,
} from "./domain/student";
import { mapResponse } from "../../core/interceptor/response";

import { t } from "elysia";
export const StudentDocs = {
  createStudent: {
    detail: {
      summary: "Create student",
      description: "Create a new student with the provided information",
      tags: ["Students"],
    },
    body: CreateStudentDTO,
    response: {
      201: mapResponse(StudentDTO),
    },
  },
  getStudents: {
    detail: {
      summary: "Get student",
      description: "Retrieve a student's information by their ID",
      tags: ["Students"],
    },
    query: StudentQueryParams,
    response: {
      200: mapResponse(t.Array(StudentDTO)),
    },
  },
  getStudentById: {
    detail: {
      summary: "Get student by ID",
      description: "Retrieve a student's information by their ID",
      tags: ["Students"],
    },
    params: t.Object({
      id: t.Number(),
    }),
    response: {
      200: mapResponse(StudentDTO),
      404: mapResponse(t.Null()),
    },
  },
};
