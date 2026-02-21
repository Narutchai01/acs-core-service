import { ProjectRepository } from "../../infrastructure/project.repository";
import { ProjectService } from "./project.service";
import { prisma } from "../../lib/db";
import { SupabaseService } from "../../core/utils/supabase";
import { ProjectFactory } from "./project.factory";
import Elysia from "elysia";
import { ProjectDocs } from "./project.docs";

const projectRepository = new ProjectRepository(prisma);
const supabaseService = new SupabaseService();
const projectFactory = new ProjectFactory();
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
        return project;
      },
      {
        ...ProjectDocs.createProject,
      },
    ),
  );
