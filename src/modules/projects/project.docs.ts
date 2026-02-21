import { CreateProjectDTO, ProjectDTO } from "./domain/project";
import { mapResponse } from "../../core/interceptor/response";

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
};
