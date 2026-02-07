import { t } from "elysia";
import { CreateNewsDTO, NewsDTO, NewsSchema } from "./domain/news";
import { mapResponse } from "../../core/interceptor/response";
export const NewsDocs = {
  createNews: {
    detail: {
      summary: "Create news",
      description: "Create a new news item with the provided information",
      tags: ["News"],
    },
    transform({ body }: { body: CreateNewsDTO }) {
      if (body.startDate && typeof body.startDate === "string") {
        body.startDate = new Date(body.startDate);
      }

      // เช็คและแปลง dueDate
      if (body.dueDate && typeof body.dueDate === "string") {
        body.dueDate = new Date(body.dueDate);
      }
    },
    body: t.Omit(NewsSchema, [
      "id",
      "createdAt",
      "updatedAt",
      "image",
      "deteletedAt",
      "tags",
      "createdBy",
      "updatedBy",
    ]),
    response: mapResponse(NewsDTO),
  },
  getNews: {
    detail: {
      summary: "Get all news",
      description: "Retrieve a list of all news items",
      tags: ["News"],
    },
    response: mapResponse(t.Array(NewsDTO)),
  },
};
