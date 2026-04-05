import { ProjectRepository } from "../../infrastructure/project.repository";
import { ProjectService } from "./project.service";
import { prisma } from "../../lib/db";
import { SupabaseService } from "../../core/utils/supabase";
import { ProjectFactory } from "./project.factory";
import Elysia from "elysia";
import { ProjectDocs } from "./project.docs";
import { success } from "../../core/interceptor/response";
import { HttpStatusCode } from "../../core/types/http";
import { UserFactory } from "../users/user.factory";
import { CourseFactory } from "../courses/course.factory";

const projectRepository = new ProjectRepository(prisma);
const supabaseService = new SupabaseService();
const userFactory = new UserFactory();
const courseFactory = new CourseFactory();
const projectFactory = new ProjectFactory(userFactory, courseFactory);
const projectService = new ProjectService(
  projectRepository,
  supabaseService,
  projectFactory,
);

export const ProjectController = (app: Elysia) =>
  app.decorate("projectService", projectService).guard({}, (privateApp) =>
    privateApp.post(
      "",
      async ({ body, projectService }) => {
        const project = await projectService.createProject(body);
        return success(project);
      },
      {
        ...ProjectDocs.createProject,
      },
    ),
  )
  .get(
    "",
    async ({ projectService, query, set }) => {
      const projectList = await projectService.getProject(query);
          set.status = HttpStatusCode.OK;
          return success(projectList, "Project retrieved successfully");
    },
    ProjectDocs.getProject,
  )
  .get(
        "/:id",
        async ({ projectService, params, set }) => {
          const project = await projectService.getProjectById(params.id);
          
          if (!project) {
            set.status = HttpStatusCode.NOT_FOUND || 404;
            return success(
              null,
              "Project not found",
              HttpStatusCode.NOT_FOUND
            );
          }
          
          return success(
            project,
            "Project retrieved successfully"
          );
        },
        {
          ...ProjectDocs.getProjectById,
        },
      )
