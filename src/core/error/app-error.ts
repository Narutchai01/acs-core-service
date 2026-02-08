import { ErrorCode } from "../types/errors";

export class AppError extends Error {
  constructor(
    public type: ErrorCode,
    public message: string, // ข้อความอธิบาย
    public statusCode: number = 400, // HTTP Status (default 400)
  ) {
    super(message);
  }
}
