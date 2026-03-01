# ใช้ Bun image แบบ Multi-stage เพื่อแยกส่วน Build และ Run
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# --- Stage 1: Install Dependencies & Generate Prisma ---
FROM base AS install
# คัดลอกเฉพาะไฟล์ที่จำเป็นสำหรับการ Install เพื่อใช้ประโยชน์จาก Docker Layer Cache
COPY package.json bun.lock ./
COPY prisma ./prisma/

# ติดตั้งแพ็กเกจทั้งหมด (ไม่ต้องใส่ --production เผื่อต้องใช้ dev dependencies ตอน generate)
RUN bun install --frozen-lockfile

# Generate Prisma Client ให้อยู่ใน node_modules
RUN bunx prisma generate

# --- Stage 2: Final Production Image ---
FROM base AS release
# คัดลอก node_modules ที่ผ่านการ generate prisma แล้วมาจาก Stage 1
COPY --from=install /usr/src/app/node_modules ./node_modules
# คัดลอก Source code ที่เหลือทั้งหมด
COPY . .

# แก้ไข Path ของไฟล์ Entrypoint ให้ตรงกับที่เรียกใช้จริง
RUN sed -i 's/\r$//' ./entrypoint/setup.sh \
    && chmod +x ./entrypoint/setup.sh

# เปลี่ยนจาก USER node เป็น USER bun (Official Bun image แนะนำให้ใช้ user 'bun')
USER bun

# เปิดพอร์ตที่แอปพลิเคชันใช้งาน (Elysia โดยทั่วไปใช้ 3000)

ENTRYPOINT [ "./entrypoint/setup.sh" ]
CMD ["bun", "run", "src/index.ts"]