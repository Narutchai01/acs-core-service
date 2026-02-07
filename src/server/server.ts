import { Elysia } from "elysia";
import { healthContoller } from "../modules/health/health.controller";

export class Server {
  constructor(
    private readonly port: number,
    private readonly hostname: string,
  ) {}
  start() {
    const app = new Elysia({ prefix: "/api" });

    app.group("/v1", (app) => app.use(healthContoller));

    app.listen({ port: this.port, hostname: this.hostname });

    console.log(
      `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
    );
  }
}
