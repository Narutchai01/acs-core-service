import Elysia from "elysia";
import { jwt } from "@elysiajs/jwt";

// สร้าง Plugin แยกออกมา เพื่อให้ Reuse ได้
export const jwtPlugin = new Elysia().use(
  jwt({
    name: "jwt",
    secret: process.env.JWT_SECRET || "secret",
    exp: "7d",
  }),
);
