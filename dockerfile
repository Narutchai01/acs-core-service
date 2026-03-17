# ใช้ Bun image แบบ Multi-stage เพื่อแยกส่วน Build และ Run
FROM oven/bun:1-baseline AS base
WORKDIR /usr/src/app
# --- Stage 1: Install Dependencies & Generate Prisma ---
FROM base AS install
COPY package.json bun.lock ./
COPY prisma ./prisma/
RUN bun install --frozen-lockfile
RUN bunx prisma generate
# --- Stage 2: Final Production Image ---
FROM base AS release
COPY . .
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY --from=install /usr/src/app/src/generated ./src/generated
RUN sed -i 's/\r$//' ./entrypoint/setup.sh \
    && chmod +x ./entrypoint/setup.sh
USER bun
ENTRYPOINT [ "./entrypoint/setup.sh" ]
CMD ["bun", "run", "src/index.ts"]