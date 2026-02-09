import { Server } from "./server/server";
import { config } from "./core/config/config";

if (!config.APP_PORT) {
  throw new Error("APP_PORT is not defined in environment variables.");
}

const server = new Server(config.APP_PORT, "localhost");
server.start();
