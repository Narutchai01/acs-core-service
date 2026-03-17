FROM debian:bookworm-slim AS base
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y curl unzip openssl nodejs npm && \
    curl -fsSL https://github.com/oven-sh/bun/releases/download/bun-v1.3.10/bun-linux-x64-baseline.zip -o bun.zip && \
    unzip bun.zip && \
    mv bun-linux-x64-baseline/bun /usr/local/bin/bun && \
    ln -s /usr/local/bin/bun /usr/local/bin/bunx && \
    rm -rf bun.zip bun-linux-x64-baseline && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# --- Stage 1: Install Dependencies & Generate Prisma ---
# --- Stage 1: Install Dependencies & Generate Prisma ---
FROM base AS install
COPY package.json bun.lock ./
COPY prisma ./prisma/
RUN bun install
RUN node node_modules/.bin/prisma generate
# --- Stage 2: Final Production Image ---
FROM base AS release
COPY . .
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY --from=install /usr/src/app/src/generated ./src/generated
RUN sed -i 's/\r$//' ./entrypoint/setup.sh \
    && chmod +x ./entrypoint/setup.sh
ENTRYPOINT [ "./entrypoint/setup.sh" ]
CMD ["bun", "run", "src/index.ts"]