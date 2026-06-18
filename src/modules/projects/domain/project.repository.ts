import { Prisma } from "../../../generated/prisma/client";
import { Project, ProjectQueryParams } from "./project";

export interface IProjectRepository {
  createProject( 
    proejctData: Prisma.ProjectUncheckedCreateInput,
  ): Promise<Project>;
  createProjectTag(
    data: Prisma.ProjectTagUncheckedCreateInput[],
  ): Promise<void>;
  deleteProjectTag(
    projectID: number,
    tagID: number[],
  ): Promise<void>;
  createProjectMember(
    data: Prisma.ProjectMemberUncheckedCreateInput[],
  ): Promise<void>;
  deleteProjectMember(
    projectID: number,
    userID: number[],
  ): Promise<void>;
  createProjectCourse(
    data: Prisma.ProjectCourseUncheckedCreateInput[],
  ): Promise<void>;
  deleteProjectCourse(
    projectID: number,
    courseID: number[],
  ): Promise<void>;
  getProject(query: ProjectQueryParams): Promise<Project[]>
  getProjectById(id: number): Promise<Project | null>;
  countProject(query: ProjectQueryParams): Promise<number>
  updateProject(
    id: number,
    projectData: Prisma.ProjectUncheckedUpdateInput,
  ): Promise<Project>;
}
