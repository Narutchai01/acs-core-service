import { createHmac } from "node:crypto";
import { describe, expect, test } from "bun:test";
import { Elysia } from "elysia";
import { responseEnhancer } from "../../../src/core/interceptor/response";
import type { NewsDTO } from "../../../src/modules/news/domain/news";
import { createNewsController } from "../../../src/modules/news/news.controller";
import type { NewsService } from "../../../src/modules/news/news.service";

const startDate = "2026-08-02T00:00:00.000Z";

const newsFixture = (focalPoints?: {
  cardFocalPointX?: number;
  cardFocalPointY?: number;
  thumbnailFocalPointX?: number;
  thumbnailFocalPointY?: number;
}): NewsDTO => ({
  id: 1,
  title: "News title",
  detail: "News detail",
  startDate: new Date(startDate),
  dueDate: null,
  thumbnailURL: "https://example.com/thumbnail.jpg",
  highlightURL: "https://example.com/highlight.jpg",
  cardFocalPointX: focalPoints?.cardFocalPointX ?? null,
  cardFocalPointY: focalPoints?.cardFocalPointY ?? null,
  thumbnailFocalPointX: focalPoints?.thumbnailFocalPointX ?? null,
  thumbnailFocalPointY: focalPoints?.thumbnailFocalPointY ?? null,
  tag: { id: 1, name: "Announcement", tagsGroupsId: 1 },
});

const createAdminToken = () => {
  const encode = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const header = encode({ alg: "HS256", typ: "JWT" });
  const payload = encode({
    id: 1,
    roles: ["admin"],
    exp: Math.floor(Date.now() / 1000) + 60,
  });
  const signature = createHmac("sha256", process.env.JWT_SECRET || "secret")
    .update(`${header}.${payload}`)
    .digest("base64url");

  return `${header}.${payload}.${signature}`;
};

const createNewsForm = (focalPoints?: {
  cardFocalPointX?: number;
  cardFocalPointY?: number;
  thumbnailFocalPointX?: number;
  thumbnailFocalPointY?: number;
}) => {
  const form = new FormData();
  form.set("title", "News title");
  form.set("detail", "News detail");
  form.set("startDate", startDate);
  form.set("tagID", "1");
  form.set(
    "thumbnail",
    new File(["thumbnail"], "thumbnail.jpg", { type: "image/jpeg" }),
  );
  form.set(
    "highlight",
    new File(["highlight"], "highlight.jpg", { type: "image/jpeg" }),
  );

  for (const [key, value] of Object.entries(focalPoints ?? {})) {
    form.set(key, String(value));
  }

  return form;
};

const createApp = (newsService: NewsService) =>
  new Elysia().use(responseEnhancer).use(createNewsController(newsService));

describe("news HTTP endpoints", () => {
  test("POST /news accepts focal points", async () => {
    let receivedBody: Record<string, unknown> | undefined;
    const app = createApp({
      createNews: async (body) => {
        receivedBody = body as Record<string, unknown>;
        return newsFixture({
          cardFocalPointX: 25.5,
          cardFocalPointY: 75.25,
          thumbnailFocalPointX: 40,
          thumbnailFocalPointY: 60,
        });
      },
    } as NewsService);

    const response = await app.handle(
      new Request("http://localhost/news", {
        method: "POST",
        headers: { cookie: `accessToken=${createAdminToken()}` },
        body: createNewsForm({
          cardFocalPointX: 25.5,
          cardFocalPointY: 75.25,
          thumbnailFocalPointX: 40,
          thumbnailFocalPointY: 60,
        }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(receivedBody).toMatchObject({
      cardFocalPointX: 25.5,
      cardFocalPointY: 75.25,
      thumbnailFocalPointX: 40,
      thumbnailFocalPointY: 60,
    });
    expect(body.data).toMatchObject({
      cardFocalPointX: 25.5,
      cardFocalPointY: 75.25,
      thumbnailFocalPointX: 40,
      thumbnailFocalPointY: 60,
    });
  });

  test("POST /news accepts news without focal points", async () => {
    let receivedBody: Record<string, unknown> | undefined;
    const app = createApp({
      createNews: async (body) => {
        receivedBody = body as Record<string, unknown>;
        return newsFixture();
      },
    } as NewsService);

    const response = await app.handle(
      new Request("http://localhost/news", {
        method: "POST",
        headers: { cookie: `accessToken=${createAdminToken()}` },
        body: createNewsForm(),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(receivedBody).not.toHaveProperty("cardFocalPointX");
    expect(receivedBody).not.toHaveProperty("cardFocalPointY");
    expect(receivedBody).not.toHaveProperty("thumbnailFocalPointX");
    expect(receivedBody).not.toHaveProperty("thumbnailFocalPointY");
    expect(body.data).toMatchObject({
      cardFocalPointX: null,
      cardFocalPointY: null,
      thumbnailFocalPointX: null,
      thumbnailFocalPointY: null,
    });
  });

  test("GET /news returns focal points", async () => {
    const app = createApp({
      getNews: async () => ({
        rows: [newsFixture({ cardFocalPointX: 20, cardFocalPointY: 80 })],
        totalRecords: 1,
        page: 1,
        pageSize: 10,
      }),
    } as NewsService);

    const response = await app.handle(new Request("http://localhost/news"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toMatchObject({
      rows: [
        {
          id: 1,
          cardFocalPointX: 20,
          cardFocalPointY: 80,
          thumbnailFocalPointX: null,
          thumbnailFocalPointY: null,
        },
      ],
      totalRecords: 1,
    });
  });

  test("GET /news/:id returns news without focal points", async () => {
    const app = createApp({
      getNewsById: async () => newsFixture(),
    } as NewsService);

    const response = await app.handle(new Request("http://localhost/news/1"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toMatchObject({
      id: 1,
      cardFocalPointX: null,
      cardFocalPointY: null,
      thumbnailFocalPointX: null,
      thumbnailFocalPointY: null,
    });
  });
});
