import Elysia from "elysia";
import { jwtPlugin } from "../core/plugins/jwt";
import { AppError } from "../core/error/app-error";
import { ErrorCode } from "../core/types/errors";
import { HttpStatusCode } from "../core/types/http";

export const authMiddleware = (app: Elysia) =>
  app.use(jwtPlugin).derive(async ({ jwt, cookie: { accessToken } }) => {
    const token = accessToken;

    if (!token) {
      throw new AppError(
        ErrorCode.AUTHENTICATION_ERROR,
        "Unauthorized",
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const payload = await jwt.verify(token.value as string);

    if (!payload) {
      throw new AppError(
        ErrorCode.AUTHENTICATION_ERROR,
        "Invalid token",
        HttpStatusCode.UNAUTHORIZED,
      );
    }
    const user = {
      userID: payload.userID as number,
      roles: payload.roles,
    };

    return user;
  });
