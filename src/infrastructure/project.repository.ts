import { Prisma, PrismaClient } from "../generated/prisma/client";
import {
  ProjectUncheckedCreateInput,
  ProjectTagUncheckedCreateInput,
  ProjectMemberUncheckedCreateInput,
  ProjectCourseUncheckedCreateInput,
} from "../generated/prisma/models";
import { IProjectRepository } from "../modules/projects/domain/project.repository";
import { Project } from "../modules/projects/domain/project";
import { ErrorCode } from "../core/types/errors";
import { AppError } from "../core/error/app-error";

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

  async createProjectCourse(
    data: ProjectCourseUncheckedCreateInput[],
  ): Promise<void> {
    await this.db.projectCourse.createMany({
      data,
    });
  }

  async getProjectById(id: number): Promise<Project | null> {
    try {
      const project = await this.db.project.findUnique({
        where: { id, deletedAt: null }, 
      });
      return project as unknown as Project | null;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return null;
        }
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "An error occurred while fetching the project",
        500,
      );
    }
  }
}
