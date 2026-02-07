import { Server } from "./server/server";
import { config } from "./core/config/config";

const server = new Server(config.APP_PORT, "localhost");
server.start();
