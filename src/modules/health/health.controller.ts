import Elysia from "elysia";
import { HealthService } from "./health.service";

const healthService = new HealthService();

export const healthContoller = new Elysia({ prefix: "/health" }).decorate(
  "healthService",
  healthService,
);

healthContoller.get("/", async () => {
  return healthService.getHealthStatus();
});
