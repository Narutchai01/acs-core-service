import { Prisma } from "../../../generated/prisma/client";
import { Project } from "./project";

export interface IProjectRepository {
  createProject( 
    proejctData: Prisma.ProjectUncheckedCreateInput,
  ): Promise<Project>;
  createProjectTag(
    data: Prisma.ProjectTagUncheckedCreateInput[],
  ): Promise<void>;
  createProjectMember(
    data: Prisma.ProjectMemberUncheckedCreateInput[],
  ): Promise<void>;
  createProjectCourse(
    data: Prisma.ProjectCourseUncheckedCreateInput[],
  ): Promise<void>;
  getProjectById(id: number): Promise<Project | null>;
}
