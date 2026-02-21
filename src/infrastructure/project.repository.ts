import { PrismaClient } from "../generated/prisma/client";
import {
  ProjectUncheckedCreateInput,
  ProjectTagUncheckedCreateInput,
  ProjectMemberUncheckedCreateInput,
} from "../generated/prisma/models";
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

  async createProjectTag(
    data: ProjectTagUncheckedCreateInput[],
  ): Promise<void> {
    await this.db.projectTag.createMany({
      data,
    });
  }

  async createProjectMember(
    data: ProjectMemberUncheckedCreateInput[],
  ): Promise<void> {
    await this.db.projectMember.createMany({
      data,
    });
  }
}
