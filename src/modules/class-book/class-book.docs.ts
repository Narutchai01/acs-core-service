import { t } from "elysia";
import { mapResponse } from "../../core/interceptor/response";
import {
  CreateClassBookDTO,
  ClassBookDTO,
  ClassBookQueryParams,
} from "./domain/class-book";

export const ClassBookDocs = {
  createClassBook: {
    detail: {
      summary: "Create a new class book",
      description:
        "This endpoint allows you to create a new class book by providing the necessary details such as title, author, and thumbnail image. The thumbnail image is uploaded to the storage service and its URL is saved in the database along with other class book information.",
      tags: ["Class Books"],
    },
    body: CreateClassBookDTO,
    Response: {
      201: mapResponse(ClassBookDTO),
    },
  },
  getClassBooks: {
    detail: {
      summary: "Get a list of class books",
      description:
        "This endpoint retrieves a list of class books based on the provided query parameters. You can filter the class books by various criteria such as title, author, or creation date.",
      tags: ["Class Books"],
    },
    query: ClassBookQueryParams,
    Response: {
      200: mapResponse(ClassBookDTO),
      500: mapResponse(t.Null()),
    },
  },
  getClassBookById: {
    detail: {
      summary: "Get a class book by ID",
      description:
        "This endpoint retrieves the details of a specific class book using its unique ID. If the class book is found, its information is returned; otherwise, a not found response is provided.",
      tags: ["Class Books"],
    },
    params: t.Object({
      id: t.Numeric(),
    }),
    Response: {
      200: mapResponse(ClassBookDTO),
      404: mapResponse(t.Null()),
    },
  },
};
