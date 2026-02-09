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

export const ClassBookController = new Elysia({ prefix: "/class-books" })
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
  );
