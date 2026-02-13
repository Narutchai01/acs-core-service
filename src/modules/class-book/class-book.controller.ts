import { Elysia } from "elysia";
import { prisma } from "../../lib/db";
import { ClassBookRepository } from "../../infrastructure/class-book.repository";
import { ClassBookService } from "./class-book.service";
import { ClassBookFactory } from "./class-book.factory";
import { SupabaseService } from "../../core/utils/supabase";
import { success } from "../../core/interceptor/response";
import { HttpStatusCode } from "../../core/types/http";
import { ClassBookDocs } from "./class-book.docs";

const supabaseService = new SupabaseService();
const classBookRepository = new ClassBookRepository(prisma);
const classBookFactory = new ClassBookFactory();
const classBookService = new ClassBookService(
  classBookRepository,
  classBookFactory,
  supabaseService,
);

export const ClassBookController = (app: Elysia) =>
  app.group("/class-books", (app) =>
    app
      .decorate("classBookService", classBookService)
      .post(
        "/",
        async ({ classBookService, body, set }) => {
          const classBook = await classBookService.createClassBook(body);
          set.status = HttpStatusCode.CREATED;
          return success(
            classBook,
            "Class book created successfully",
            HttpStatusCode.CREATED,
          );
        },
        ClassBookDocs.createClassBook,
      )
      .get(
        "/",
        async ({ classBookService, query, set }) => {
          const classBooks = await classBookService.getClassBooks(query);
          set.status = HttpStatusCode.OK;
          return success(classBooks, "Class books retrieved successfully");
        },
        ClassBookDocs.getClassBooks,
      )
      .get(
        "/:id",
        async ({ classBookService, params, set }) => {
          try {
            const classBook = await classBookService.getClassBookById(
              params.id,
            );
            if (!classBook) {
              set.status = HttpStatusCode.NOT_FOUND;
              return success(
                null,
                "Class book not found",
                HttpStatusCode.NOT_FOUND,
              );
            }
            return success(classBook, "Class book retrieved successfully");
          } catch (error) {
            console.log(error);
          }
        },
        ClassBookDocs.getClassBookById,
      ),
  );
