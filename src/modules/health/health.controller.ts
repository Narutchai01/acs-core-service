import Elysia from "elysia";
import { HealthService } from "./health.service";

const healthService = new HealthService();

export const healthContoller = (app: Elysia) =>
  app.decorate("healthService", healthService).group("health", (app) =>
    app.get(
      "",
      async () => {
        return healthService.getHealthStatus();
      },
      {
        detail: {
          summary: "Health Check",
          description: "Check the health status of the service",
          tags: ["Health"],
        },
      },
    ),
  );
