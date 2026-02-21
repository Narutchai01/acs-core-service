import { PrismaClient } from "../generated/prisma/client";
import { ProjectUncheckedCreateInput } from "../generated/prisma/models";
import { IProjectRepository } from "../modules/projects/domain/project.repository";
import { Project } from "../modules/projects/domain/project";

export class ProjectRepository implements IProjectRepository {
  constructor(private readonly db: PrismaClient) {}

  async createProject(
    proejctData: ProjectUncheckedCreateInput,
  ): Promise<Project> {
    const createdProject = await this.db.project.create({
      data: proejctData,
    });

    return createdProject as unknown as Project;
  }
}
