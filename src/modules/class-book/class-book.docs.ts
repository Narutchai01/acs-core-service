import { CreateClassBookDTO, ClassBookDTO } from "./domain/class-book";

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
      201: ClassBookDTO,
    },
  },
};
