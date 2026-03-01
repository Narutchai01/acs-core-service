FROM oven/bun:1 AS base
WORKDIR /usr/src/app


COPY . ./


RUN bun install --production


ENTRYPOINT [ "/usr/src/app/entrypoint/setup.sh" ]


CMD ["bun", "run", "src/index.ts"]