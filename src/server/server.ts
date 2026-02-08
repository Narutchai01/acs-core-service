import { Elysia } from "elysia";
import { prisma } from "../lib/db";
import { logger } from "elysia-logger";
import { userController } from "../modules/users/user.controller";
import { openapi } from "@elysiajs/openapi";
import { newsController } from "../modules/news/news.controller";
import { healthContoller } from "../modules/health/health.controller";
import { responseEnhancer } from "../core/interceptor/response";
import { errorPlugin } from "../core/interceptor/error";

export class Server {
  constructor(
    private readonly port: number,
    private readonly hostname: string,
  ) {}
  start() {
    const app = new Elysia({ prefix: "/api" })
      .use(
        openapi({
          path: "/docs",
          documentation: {
            info: {
              title: "ACS Core Service API",
              version: "1.0.0",
              description: "API Documentation",
            },
            tags: [
              { name: "Auth", description: "Authentication Endpoints" },
              {
                name: "Users ",
                description: "User Management Endpoints",
              },
              {
                name: "Health",
                description: "Health Check Endpoints",
              },
              {
                name: "News",
                description: "News Management Endpoints",
              },
            ],
          },
          // เลือก Provider: 'scalar' (สวย/ใหม่) หรือ 'swagger' (คลาสสิก)
          provider: "scalar", // หรือ 'swagger'
        }),
      )
      .use(responseEnhancer)
      .use(errorPlugin)

      .use(logger())

      .decorate("prisma", prisma);

    app.group("/v1", (app) =>
      app.use(healthContoller).use(newsController).use(userController),
    );

    app.listen({ port: this.port, hostname: this.hostname });

    console.log(
      `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
    );
  }
}
