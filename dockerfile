FROM debian:bookworm-slim AS base
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y curl unzip && \
    curl -fsSL https://bun.sh/install | bash && \
    cp /root/.bun/bin/bun /usr/local/bin/bun && \
    ln -s /usr/local/bin/bun /usr/local/bin/bunx && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

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
ENTRYPOINT [ "./entrypoint/setup.sh" ]
CMD ["bun", "run", "src/index.ts"]