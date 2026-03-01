# ใช้ Bun image แบบ Multi-stage เพื่อแยกส่วน Build และ Run
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# --- Stage 1: Install Dependencies & Generate Prisma ---
FROM base AS install
COPY package.json bun.lock ./
COPY prisma ./prisma/
RUN bun install --frozen-lockfile
# ตอนรันคำสั่งนี้ ไฟล์จะไปเกิดที่ /usr/src/app/src/generated/prisma/client (ตามที่คุณตั้งไว้)
RUN bunx prisma generate

# --- Stage 2: Final Production Image ---
FROM base AS release
# 1. คัดลอก Source code ของเรามาก่อน (จากเครื่องโฮสต์)
COPY . .

# 2. คัดลอก node_modules จาก Stage 1
COPY --from=install /usr/src/app/node_modules ./node_modules

# 3. คัดลอกโฟลเดอร์ generated ที่ Prisma สร้างไว้จาก Stage 1 มาทับ (สำคัญมาก!)
COPY --from=install /usr/src/app/src/generated ./src/generated

# แก้ไข Path ของไฟล์ Entrypoint ให้ตรงกับที่เรียกใช้จริง
RUN sed -i 's/\r$//' ./entrypoint/setup.sh \
    && chmod +x ./entrypoint/setup.sh

USER bun


ENTRYPOINT [ "./entrypoint/setup.sh" ]
CMD ["bun", "run", "src/index.ts"]