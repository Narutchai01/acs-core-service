import Elysia from "elysia";
import { CourseRepository } from "../../infrastructure/course.repository";
import { prisma } from "../../lib/db";
import { CourseService } from "./course.service";
import { success } from "../../core/interceptor/response";
import { HttpStatusCode } from "../../core/types/http";
import { CourseDocs } from "./course.docs";
import { CourseFactory } from "./course.factory";

const courseRepository = new CourseRepository(prisma);
const courseFactory = new CourseFactory();
const courseService = new CourseService(courseRepository, courseFactory);

export const CourseController = new Elysia({ prefix: "/courses" })
  .decorate("courseService", courseService)
  .post(
    "/",
    async ({ courseService, body, set }) => {
      const course = await courseService.createCourse(body);
      set.status = HttpStatusCode.CREATED;
      return success(
        course,
        "Course created successfully",
        HttpStatusCode.CREATED,
      );
    },
    CourseDocs.creteCourse,
  )
  .get(
    "/",
    async ({ courseService, query, set }) => {
      const courses = await courseService.getCourses(query);
      if (!courses) {
        return success([], "No courses found", HttpStatusCode.OK);
      }
      set.status = HttpStatusCode.OK;
      return success(
        courses,
        "Courses retrieved successfully",
        HttpStatusCode.OK,
      );
    },
    CourseDocs.getCourses,
  );
