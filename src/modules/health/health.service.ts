import { HealthStatus } from "./health";
interface IHealthService {
  getHealthStatus(): Promise<HealthStatus>;
}

export class HealthService implements IHealthService {
  async getHealthStatus(): Promise<HealthStatus> {
    return { status: "OK", msg: "Service is healthy" };
  }
}
