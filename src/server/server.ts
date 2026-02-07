import { Elysia } from "elysia";
import { healthContoller } from "../modules/health/health.controller";
import { prisma } from "../lib/db";
import { logger } from "elysia-logger";
import { userController } from "../modules/users/user.controller";
import { openapi } from "@elysiajs/openapi";

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
            ],
          },
          // เลือก Provider: 'scalar' (สวย/ใหม่) หรือ 'swagger' (คลาสสิก)
          provider: "scalar", // หรือ 'swagger'
        }),
      )
      .mapResponse(({ responseValue, set }) => {
        // ถ้า format มาแล้ว ไม่ต้องครอบซ้ำ
        if (
          typeof responseValue === "object" &&
          responseValue !== null &&
          "status" in responseValue &&
          "data" in responseValue &&
          "msg" in responseValue &&
          "err" in responseValue
        ) {
          return Response.json(responseValue);
        }

        const statusCode = typeof set.status === "number" ? set.status : 200;

        return Response.json({
          status: statusCode,
          data: responseValue,
          msg: "success",
          err: null,
        });
      })
      .use(logger())

      .decorate("prisma", prisma);

    app.group("/v1", (app) => app.use(healthContoller).use(userController));

    app.listen({ port: this.port, hostname: this.hostname });

    console.log(
      `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
    );
  }
}
