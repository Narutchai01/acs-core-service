import { Elysia } from "elysia";
import { AppError } from "../error/app-error";
import { ErrorCode } from "../types/errors";

export const errorPlugin = new Elysia({ name: "error-plugin" }).onError(
  ({ code, error, set }) => {
    // 1. กรณีเป็น AppError (Error ที่เราตั้งใจ Throw เองจาก Service/Repo)
    if (error instanceof AppError) {
      set.status = error.statusCode;
      return {
        success: false,
        code: error.type, // ส่ง Enum กลับไป (เช่น DUPLICATE_DATA_ERROR)
        message: error.message,
      };
    }

    // 2. กรณี Validation Error (Elysia ตรวจ Schema ไม่ผ่าน)
    if (code === "VALIDATION") {
      set.status = 400;
      return {
        success: false,
        code: ErrorCode.VALIDATION_ERROR, // ใช้ Enum กลาง
        message: "Validation failed",
        details: error.all, // ส่งรายละเอียดว่า field ไหนผิด
      };
    }

    // 3. กรณี Route Not Found (เรียก URL ผิด)
    if (code === "NOT_FOUND") {
      set.status = 404;
      return {
        success: false,
        code: ErrorCode.NOT_FOUND_ERROR,
        message: "Resource not found",
      };
    }

    // 4. กรณี Parse Error (ส่ง JSON ผิด format)
    if (code === "PARSE") {
      set.status = 400;
      return {
        success: false,
        code: ErrorCode.VALIDATION_ERROR,
        message: "Failed to parse request body",
      };
    }

    console.error("🔥 System Error:", error);

    set.status = 500;
    return {
      success: false,
      code: ErrorCode.GENERIC_ERROR, // หรือ INTERNAL_SERVER_ERROR
      message: "Something went wrong on the server",
    };
  },
);
