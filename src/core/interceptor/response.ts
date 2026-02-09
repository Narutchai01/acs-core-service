import { Elysia, t, type TSchema } from "elysia";

// Helper function สำหรับส่ง Success Response
export function success<T>(data: T, msg = "Success", status = 200) {
  return {
    status: status,
    data,
    msg,
    err: null,
  };
}

export const mapResponse = (schema: TSchema) => {
  return t.Object({
    status: t.Number(),
    data: schema,
    msg: t.String(),
    err: t.Union([t.String(), t.Null()]),
  });
};

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
