import Elysia from "elysia";
import { jwtPlugin } from "../core/plugins/jwt";

export const authMiddleware = (app: Elysia) =>
  app.use(jwtPlugin).derive(async ({ jwt, cookie: { accessToken } }) => {
    const token = accessToken;

    const userID = await jwt.verify(token.value as string);

    return { userID: (userID as { id: number }).id };
  });
