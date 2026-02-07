import { Elysia, t } from "elysia";

export const responseTemplate = t.Object({
  status: t.Number(),
  data: t.Union([t.Null(), t.Any()]),
  msg: t.String(),
  err: t.Union([t.Null(), t.String()]),
});

export function mapResponse<T>(
  response: T,
  msg = "Request successful",
  statudCode = 200,
  err = null,
) {
  return {
    status: 200,
    data: response,
    msg: msg,
    err: null,
  };
}

const getStatusCode = (code: number | string): number => {
  if (typeof code === "number") return code;
  if (code === "NOT_FOUND") return 404;
  if (code === "VALIDATION") return 400;
  if (code === "PARSE") return 400;
  return 500;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "Internal Server Error";
};

export const responseEnhancer = new Elysia({ name: "responseEnhancer" })
  // ดัก error ก่อน
  .onError(({ code, error, set }) => {
    const statusCode = getStatusCode(code);
    set.status = statusCode;

    return {
      status: statusCode,
      data: null,
      msg: getErrorMessage(error),
      err: String(code),
    };
  });

// ใช้ mapResponse แทน onAfterHandle
