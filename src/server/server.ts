import { Elysia } from "elysia";
import { logger } from "elysia-logger";
import { openapi } from "@elysiajs/openapi";
import { responseEnhancer } from "../core/interceptor/response";
import { errorPlugin } from "../core/interceptor/error";
import { openapiConfig } from "./openapi.config";
import { RouteSetup } from "../routes/routes";
import jwt from "@elysiajs/jwt";

export class Server {
  constructor(
    private readonly port: number,
    private readonly hostname: string,
  ) {}
  start() {
    const app = new Elysia({ prefix: "/api" })
      .use(openapi(openapiConfig))
      .use(
        jwt({
          secret: "dadasd",
          name: "jwt",
          exp: "7d",
        }),
      )
      .use(responseEnhancer)
      .use(errorPlugin)
      .use(logger())
      .use(RouteSetup);

    app.listen({ port: this.port, hostname: this.hostname });

    console.log(
      `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
    );
  }
}
