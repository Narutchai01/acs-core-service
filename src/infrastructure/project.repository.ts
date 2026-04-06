import { Prisma, PrismaClient } from "../generated/prisma/client";
import {
  ProjectUncheckedCreateInput,
  ProjectTagUncheckedCreateInput,
  ProjectMemberUncheckedCreateInput,
  ProjectCourseUncheckedCreateInput,
} from "../generated/prisma/models";
import { IProjectRepository } from "../modules/projects/domain/project.repository";
import { Project ,ProjectQueryParams} from "../modules/projects/domain/project";
import { ErrorCode } from "../core/types/errors";
import { AppError } from "../core/error/app-error";
import { calculatePagination } from "../core/utils/calculator";

export class ProjectRepository implements IProjectRepository {
  constructor(
    private readonly prisma: PrismaClient
  ) 
  {}

  async createProject(

    projectData: ProjectUncheckedCreateInput,
  ): Promise<Project> {
    const createdProject = await this.prisma.project.create({
      data: {
        ...projectData,
      },
    });

    return createdProject as unknown as Project;
  }

  async createProjectTag(
    data: ProjectTagUncheckedCreateInput[],
  ): Promise<void> {
    await this.prisma.projectTag.createMany({
      data,
    });
  }

  async createProjectMember(
    data: ProjectMemberUncheckedCreateInput[],
  ): Promise<void> {
    await this.prisma.projectMember.createMany({
      data,
    });
  }

  async createProjectCourse(
    data: ProjectCourseUncheckedCreateInput[],
  ): Promise<void> {
    await this.prisma.projectCourse.createMany({
      data,
    });
  }

  async getProject(query: ProjectQueryParams): Promise<Project[]> {
    const {
      page = query.page ?? 1,
      pageSize = query.pageSize ?? 10,
      orderBy = "createdAt",
      sortBy,
    } = query;
    const ProjectList = await this.prisma.project.findMany({
       skip: calculatePagination(page, pageSize),
            take: pageSize,
            orderBy: {
              [orderBy]: sortBy,
            },
            where: {
            ...(query.tagID && {
              projectTags: {
                some: {
                  tagID: {
                    in: query.tagID,
                  },
                },
              },
            }),

            ...(query.courseID && {
              projectCourses: {
                some: {
                  courseID: {
                    in: query.courseID,
                  }
                },
              },        
            }),

            ...(query.search &&
              query.searchBy && {
              [query.searchBy]: {
              contains: query.search,
              mode: "insensitive",
            },
            }),

            deletedAt: null,
            },

            include: {
              projectTags: {
                include: { tag: true }
              },
              projectMembers: {
                include: { user: true, role: true }
              },
              projectCourses: {
                include: {
                  course: {
                    include: {
                      typeCourse: true,  
                      curriculum: true, 
                    }
                  }
                }
              }
            }
      });

    return ProjectList as unknown as Project[];
  }

  async getProjectById(id: number): Promise<Project | null> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id, deletedAt: null },
        include: {
          projectTags: {
            include: { tag: true },
          },
          projectMembers: {
            include: { user: true, role: true },
          },
          projectCourses: {
            include: {
              course: {
                include: {
                  typeCourse: true,  
                  curriculum: true, 
                }
              }
            }
          }
        },
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

  async countProject(query: ProjectQueryParams): Promise<number> {
    const count = await this.prisma.project.count({
      where: {
        ...(query.tagID && {
              projectTags: {
                some: {
                  tagID: {
                    in: query.tagID,
                  },
                },
              },
              deletedAt: null,
            }),

            ...(query.courseID && {
              projectCourses: {
                some: {
                  courseID: {
                    in: query.courseID,
                  }
                },
              },
              deletedAt: null,
            }),
        deletedAt: null,
      },
    });
    return count;
  }
}
