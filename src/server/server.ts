import { Elysia } from "elysia";
import { prisma } from "../lib/db";
import { logger } from "elysia-logger";
import { userController } from "../modules/users/user.controller";
import { openapi } from "@elysiajs/openapi";
import { newsController } from "../modules/news/news.controller";
import { healthContoller } from "../modules/health/health.controller";
import { responseEnhancer } from "../core/interceptor/response";
import { errorPlugin } from "../core/interceptor/error";
import { openapiConfig } from "./openapi.config";
import { StudentController } from "../modules/students/student.controller";

export class Server {
  constructor(
    private readonly port: number,
    private readonly hostname: string,
  ) {}
  start() {
    const app = new Elysia({ prefix: "/api" })
      .use(openapi(openapiConfig))
      .use(responseEnhancer)
      .use(errorPlugin)

      .use(logger())

      .decorate("prisma", prisma);

    app.group("/v1", (app) =>
      app
        .use(healthContoller)
        .use(newsController)
        .use(userController)
        .use(StudentController),
    );

    app.listen({ port: this.port, hostname: this.hostname });

    console.log(
      `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
    );
  }
}
