import Elysia from "elysia";
import { HealthService } from "./health.service";

const healthService = new HealthService();

export const healthContoller = new Elysia({ prefix: "/health" }).decorate(
  "healthService",
  healthService,
);

healthContoller.get(
  "/",
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
);
