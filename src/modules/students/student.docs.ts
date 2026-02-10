import {
  CreateStudentDTO,
  StudentDTO,
  StudentQueryParams,
  StudentUpdateDTO,
  CreaetListStudentDTO,
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
  deleteStudent: {
    detail: {
      summary: "Delete student",
      description: "Delete a student's information by their ID",
      tags: ["Students"],
    },
    params: t.Object({
      id: t.Number(),
    }),
    response: {
      200: mapResponse(StudentDTO),
    },
  },
  updateStudent: {
    detail: {
      summary: "Update student",
      description: "Update a student's information by their ID",
      tags: ["Students"],
    },
    transform({ body }: { body: StudentUpdateDTO }) {
      Object.keys(body).forEach((key) => {
        const k = key as keyof StudentUpdateDTO;
        if (body[k] === "") {
          body[k] = undefined;
        }
      });
    },
    params: t.Object({
      id: t.Numeric(),
    }),
    body: StudentUpdateDTO,
    response: {
      200: mapResponse(StudentDTO),
    },
  },
  createStudentBatch: {
    detail: {
      summary: "Create list of students",
      description: "Create multiple students with the provided information",
      tags: ["Students"],
    },
    body: CreaetListStudentDTO,
    response: {
      201: mapResponse(t.Array(StudentDTO)),
    },
  },
};
