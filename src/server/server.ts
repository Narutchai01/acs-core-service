import { Elysia } from "elysia";
import { logger } from "elysia-logger";
import { openapi } from "@elysiajs/openapi";
import { responseEnhancer } from "../core/interceptor/response";
import { openapiConfig } from "./openapi.config";
import { RouteSetup } from "../routes/routes";
import { errorPlugin } from "../core/plugins/error";
import { cors } from "@elysiajs/cors";
import { config } from "../core/config/config";
import { auth } from "../lib/auth";
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
      .use(
        cors({
          origin:
            config.ALLOW_ORIGIN === "*"
              ? true
              : config.ALLOW_ORIGIN.split(",").map((o) => o.trim()),
          methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
          allowedHeaders: ["Content-Type", "Authorization"],
          credentials: true,
        }),
      )
      .use(logger())
      .mount(auth.handler)
      .use(RouteSetup);

    app.listen({ port: this.port, hostname: this.hostname });

    console.log(
      `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
    );
  }
}
