import Elysia from "elysia";
import { healthContoller } from "../modules/health/health.controller";
import { newsController } from "../modules/news/news.controller";
import { userController } from "../modules/users/user.controller";
import { StudentController } from "../modules/students/student.controller";

export const RouteSetup = new Elysia();

RouteSetup.group("/v1", (app) =>
  app
    .use(healthContoller)
    .use(newsController)
    .use(userController)
    .use(StudentController),
);
