import Elysia from "elysia";
import { StudentService } from "./student.service";
import { StudentRepository } from "../../infrastructure/student.repository";
import { prisma } from "../../lib/db";
import { UserRepository } from "../../infrastructure/user.repository";
import { SupabaseService } from "../../core/utils/supabase";
import { StudentDocs } from "./student.docs";
import { StudentFactory } from "./student.factory";

const studentRepository = new StudentRepository(prisma);
const userRepository = new UserRepository(prisma);
const studentFactory = new StudentFactory();
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

StudentController.get("/", async () => {
  return "Get all students";
}).post(
  "/",
  async ({ body, studentService }) => {
    const student = await studentService.createStudent(body);
    return student;
  },
  StudentDocs.createStudent,
);
