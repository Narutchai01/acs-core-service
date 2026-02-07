import { Server } from "./server/server";

const server = new Server(3000, "localhost");
server.start();
