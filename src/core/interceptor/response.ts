import { Elysia } from "elysia";

const getStatusCode = (code: number | string): number => {
  if (typeof code === "number") return code;
  if (code === "NOT_FOUND") return 404;
  if (code === "VALIDATION") return 400;
  if (code === "PARSE") return 400;
  if (code === "INVALID_COOKIE_SIGNATURE") return 400;
  if (code === "INVALID_FILE_TYPE") return 400;
  return 500;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Internal Server Error";
};

export const responseEnhancer = new Elysia()
  // 1. จัดการ Success Response (ทำงานหลังจาก Controller return ค่า)
  .onAfterHandle(({ responseValue, set }) => {
    // ถ้า response เป็นการ redirect หรือ file ให้ปล่อยผ่าน
    if (responseValue instanceof Response) return responseValue;

    // ถ้า Controller return ค่ามาปกติ ให้จับยัดใส่ format กลาง
    return {
      status: set.status || 200,
      data: responseValue,
      msg: "Success",
      err: null,
    };
  })
  // 2. จัดการ Error Response (ทำงานเมื่อมีการ throw error)
  .onError(({ code, error, set }) => {
    // กำหนด Status Code ตามประเภท Error
    const status = getStatusCode(code);

    set.status = status;

    return {
      status: status,
      data: null,
      msg: getErrorMessage(error),
      err: code, // หรือจะใส่ error stack ก็ได้ถ้าเป็น dev mode
    };
  });
