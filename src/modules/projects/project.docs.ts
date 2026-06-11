import { CreateProjectDTO, ProjectDTO, ProjectQueryParams } from "./domain/project";
import { mapResponse } from "../../core/interceptor/response";
import { t } from "elysia";
import { Pageable } from "../../core/models";

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
  getProject: {
    detail: {
          summary: "Get all project",
          description: "Retrieve a list of all project items",
          tags: ["Projects"],
        },
        query: ProjectQueryParams,
        response: {
          200: mapResponse(Pageable(ProjectDTO)),
        },
  },
  getProjectById: {
    detail: {
      summary: "Get project by ID",
      description: "Retrieve a specific project by its ID",
      tags: ["Projects"],
    },
    params: t.Object({
      id: t.Numeric(),
    }),
    response: {
      200: mapResponse(ProjectDTO),
      404: mapResponse(t.Null()),
    },
  },
};
