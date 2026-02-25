import { Elysia } from "elysia";
import { logger } from "elysia-logger";
import { openapi } from "@elysiajs/openapi";
import { responseEnhancer } from "../core/interceptor/response";
import { openapiConfig } from "./openapi.config";
import { RouteSetup } from "../routes/routes";
import jwt from "@elysiajs/jwt";
import { errorPlugin } from "../core/plugins/error";
import { cors } from "@elysiajs/cors";
import { config } from "../core/config/config";
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
      .use(
        cors({
          origin: [config.ALLOW_ORIGIN ?? "*"],
        }),
      ) // Enable CORS with custom origin
      .use(logger())
      .use(RouteSetup);

    app.listen({ port: this.port, hostname: this.hostname });

    console.log(
      `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
    );
  }
}
