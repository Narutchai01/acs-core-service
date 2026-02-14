import Elysia from "elysia";
import { ProfessorService } from "./professor.service";
import { ProfessorRepository } from "../../infrastructure/profressor.repository";
import { ProfessorFactory } from "./profressor.factory";
import { prisma } from "../../lib/db";
import { ProfessorDocs } from "./professor.docs";
import { success } from "../../core/interceptor/response";
import { HttpStatusCode } from "../../core/types/http";
import { SupabaseService } from "../../core/utils/supabase";
import { UserRepository } from "../../infrastructure/user.repository";
import { UserFactory } from "../users/user.factory";

const userFactory = new UserFactory();
const storage = new SupabaseService();
const userRepository = new UserRepository(prisma);
const professorRepository = new ProfessorRepository(prisma);
const professorFactory = new ProfessorFactory(userFactory);
const professorService = new ProfessorService(
  professorRepository,
  userRepository,
  professorFactory,
  storage,
);

export const ProfessorController = (app: Elysia) =>
  app.group("/professors", (app) =>
    app
      .decorate("professorService", professorService)
      .post(
        "",
        async ({ professorService, body, set }) => {
          const professor = await professorService.createProfessor(body);
          if (!professor) {
            set.status = HttpStatusCode.INTERNAL_SERVER_ERROR;
            return success(
              null,
              "Failed to create professor",
              HttpStatusCode.INTERNAL_SERVER_ERROR,
            );
          }
          set.status = HttpStatusCode.CREATED;
          return success(
            professor,
            "Professor created successfully",
            HttpStatusCode.CREATED,
          );
        },
        ProfessorDocs.createProfessor,
      )
      .get(
        "",
        async ({ professorService, query, set }) => {
          const professors = await professorService.getProfessors(query);
          if (!professors) {
            set.status = HttpStatusCode.INTERNAL_SERVER_ERROR;
            return success(
              null,
              "Failed to retrieve professors",
              HttpStatusCode.INTERNAL_SERVER_ERROR,
            );
          }
          set.status = HttpStatusCode.OK;
          return success(
            professors,
            "Professors retrieved successfully",
            HttpStatusCode.OK,
          );
        },
        ProfessorDocs.getProfessors,
      )
      .get(
        "/:id",
        async ({ professorService, params, set }) => {
          const professor = await professorService.getProfessorById(
            Number(params.id),
          );
          if (!professor) {
            set.status = HttpStatusCode.NOT_FOUND;
            return success(
              null,
              "Professor not found",
              HttpStatusCode.NOT_FOUND,
            );
          }
          set.status = HttpStatusCode.OK;
          return success(
            professor,
            "Professor retrieved successfully",
            HttpStatusCode.OK,
          );
        },
        ProfessorDocs.getProfessorById,
      )
      .patch(
        "/:id",
        async ({ professorService, params, body, set }) => {
          const professor = await professorService.updateProfessor(
            Number(params.id),
            body,
          );
          if (!professor) {
            set.status = HttpStatusCode.NOT_FOUND;
            return success(
              null,
              "Professor not found",
              HttpStatusCode.NOT_FOUND,
            );
          }
          set.status = HttpStatusCode.OK;
          return success(
            professor,
            "Professor updated successfully",
            HttpStatusCode.OK,
          );
        },
        ProfessorDocs.updateProfessor,
      ),
  );
