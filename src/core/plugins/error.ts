import Elysia from "elysia";
import { AppError } from "../error/app-error";

export const errorPlugin = (app: Elysia) =>
  app.onError(({ error, set }) => {
    if (error instanceof AppError) {
      set.status = error.statusCode;
      return {
        status: error.statusCode,
        data: null,
        msg: error.message,
        err: error.type,
      };
    }
  });
