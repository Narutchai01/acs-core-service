FROM oven/bun:1 AS base
WORKDIR /usr/src/app


COPY . ./


RUN bun install --production


CMD ["bun", "run", "src/index.ts"]