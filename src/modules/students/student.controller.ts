import Elysia from "elysia";
import { StudentService } from "./student.service";
import { StudentRepository } from "../../infrastructure/student.repository";
import { prisma } from "../../lib/db";
import { UserRepository } from "../../infrastructure/user.repository";
import { SupabaseService } from "../../core/utils/supabase";
import { StudentDocs } from "./student.docs";
import { StudentFactory } from "./student.factory";
import { success } from "../../core/interceptor/response";
import { HttpStatusCode } from "../../core/types/http";
import { UserFactory } from "../users/user.factory";

const userFactory = new UserFactory();
const studentRepository = new StudentRepository(prisma);
const userRepository = new UserRepository(prisma);
const studentFactory = new StudentFactory(userFactory);
const supabaseService = new SupabaseService();

const studentService = new StudentService(
  studentRepository,
  userRepository,
  supabaseService,
  studentFactory,
);

export const StudentController = new Elysia({ prefix: "/students" }).decorate(
  "studentService",
  studentService,
);

StudentController.post(
  "/",
  async ({ body, studentService, set }) => {
    const student = await studentService.createStudent(body);
    set.status = HttpStatusCode.CREATED;
    return success(
      student,
      "Student created successfully",
      HttpStatusCode.CREATED,
    );
  },
  StudentDocs.createStudent,
)
  .get(
    "/",
    async ({ studentService, set, query }) => {
      const students = await studentService.getStudents(query);
      set.status = HttpStatusCode.OK;
      return success(students, "Students retrieved successfully");
    },
    StudentDocs.getStudents,
  )
  .get(
    "/:id",
    async ({ studentService, params, set }) => {
      const student = await studentService.getStudentById(Number(params.id));
      if (!student) {
        set.status = HttpStatusCode.NOT_FOUND;
        return success(null, "Student not found", HttpStatusCode.NOT_FOUND);
      }
      return success(student, "Student retrieved successfully");
    },
    StudentDocs.getStudentById,
  )
  .delete(
    "/:id",
    async ({ studentService, params, set }) => {
      const student = await studentService.deleteStudent(Number(params.id));
      return success(student, "Student deleted successfully");
    },
    StudentDocs.deleteStudent,
  );
