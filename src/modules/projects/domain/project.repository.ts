import { Prisma } from "../../../generated/prisma/client";
import { Project } from "./project";

export interface IProjectRepository {
  createProject(
    proejctData: Prisma.ProjectUncheckedCreateInput,
  ): Promise<Project>;
}
