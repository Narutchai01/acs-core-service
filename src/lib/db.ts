import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * ดึง Connection String จาก Environment Variables
 */
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

/**
 * ตั้งค่า PostgreSQL Driver Adapter
 * เพื่อรองรับการทำงานกับ Edge Functions หรือ Runtime อย่าง Bun/Elysia
 */
const pool = new pg.Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);

/**
 * สร้าง Instance ของ PrismaClient
 * โดยส่ง adapter เข้าไป และส่ง {} เป็น argument แรกเพื่อแก้ error 'Expected 1 arguments'
 */
export const prisma = new PrismaClient({ adapter });

// Export Type สำหรับไปใช้ใน Repository อื่นๆ (เช่น UserRepository)
export type PrismaInstance = typeof prisma;
