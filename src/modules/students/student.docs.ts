import { CreateStudentDTO } from "./domain/student";
export const StudentDocs = {
  createStudent: {
    detail: {
      summary: "Create student",
      description: "Create a new student with the provided information",
      tags: ["Students"],
    },
    body: CreateStudentDTO,
  },
};
