import { CurriculumService } from "./curriculum.service";
import { CurriculumRepository } from "../../infrastructure/curriculum.repository";
import { prisma } from "../../lib/db";
import { CurriculumFactory } from "./curriculum.factory";
import { SupabaseService } from "../../core/utils/supabase";
import { Elysia } from "elysia";
import { HttpStatusCode } from "../../core/types/http";
import { CurriculumDocs } from "./curriculum.docs";
import { success } from "../../core/interceptor/response";

const curriculumRepository = new CurriculumRepository(prisma);
const curriculumFactory = new CurriculumFactory();
const supabaseService = new SupabaseService();
const curriculumService = new CurriculumService(
  curriculumRepository,
  curriculumFactory,
  supabaseService,
);

export const CurriculumController = new Elysia()
  .decorate("curriculumService", curriculumService)
  .post(
    "/",
    async ({ curriculumService, body, set }) => {
      const curriculum = await curriculumService.createCurriculum(body);
      set.status = HttpStatusCode.CREATED;
      return success(
        curriculum,
        "Curriculum created successfully",
        HttpStatusCode.CREATED,
      );
    },
    CurriculumDocs.createCurruculum,
  );
