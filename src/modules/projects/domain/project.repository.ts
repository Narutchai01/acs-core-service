import { Prisma } from "../../../generated/prisma/client";
import { Project, ProjectQueryParams} from "./project";

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
  getProject(query: ProjectQueryParams): Promise<Project[]>
  getProjectById(id: number): Promise<Project | null>;
  countProject(query: ProjectQueryParams): Promise<number>
}
