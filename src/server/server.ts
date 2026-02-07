import { Elysia } from "elysia";
import { healthContoller } from "../modules/health/health.controller";
import { prisma } from "../lib/db";
import { logger } from "elysia-logger";
import { userController } from "../modules/users/user.controller";

export class Server {
  constructor(
    private readonly port: number,
    private readonly hostname: string,
  ) {}
  start() {
    const app = new Elysia({ prefix: "/api" })
      .use(logger())
      .decorate("prisma", prisma);

    app.group("/v1", (app) => app.use(healthContoller).use(userController));

    app.listen({ port: this.port, hostname: this.hostname });

    console.log(
      `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
    );
  }
}
