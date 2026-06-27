import { CreateProjectDTO, ProjectDTO, ProjectIdParam } from "./domain/project";
import { mapResponse } from "../../core/interceptor/response";
import { t } from "elysia";

export const ProjectDocs = {
  createProject: {
    detail: {
      summary: "Create project",
      description: "Create a new project with the provided information",
      tags: ["Projects"],
    },
    body: CreateProjectDTO,
    response: {
      201: mapResponse(ProjectDTO),
    },
  },

  getProjectById: {
    detail: {
      summary: "Get project by ID",
      description: "Retrieve a specific project by its ID",
      tags: ["Projects"],
    },
    params: ProjectIdParam,
    response: {
      200: mapResponse(ProjectDTO),
      404: mapResponse(t.Null()),
    },
  },
};
