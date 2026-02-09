import { CreateStudentDTO, StudentDTO } from "./domain/student";
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
    response: {
      200: mapResponse(t.Array(StudentDTO)),
    },
  },
};
