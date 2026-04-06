import { IProjectRepository } from "./domain/project.repository";
import { CreateProjectDTO, ProjectDTO, ProjectQueryParams } from "./domain/project";
import { SupabaseService } from "../../core/utils/supabase";
import { AppError } from "../../core/error/app-error";
import { ErrorCode } from "../../core/types/errors";
import { IProjectFactory } from "./project.factory";
import { PageableType } from "../../core/models";

interface IProjectService {
  createProject(userID: number, projectData: CreateProjectDTO): Promise<ProjectDTO>;
  getProjectById(id: number): Promise<ProjectDTO | null>;
}

export class ProjectService implements IProjectService {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly storageService: SupabaseService,
    private readonly projectFactory: IProjectFactory,
  ) {}

  async createProject(userID: number, projectData: CreateProjectDTO): Promise<ProjectDTO> {
    const {
      thumbnailFile,
      assets,
      tagsID,
      techStacks,
      members,
      coursesID,
      ...projectFields
    } = projectData;

    const assetURLs: string[] = [];

    if (!thumbnailFile) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        "Thumbnail file is required",
      );
    }

    if (assets.length === 0) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        "At least one asset file is required",
      );
    }

    const thumbnailURL = await this.storageService.uploadFile(
      thumbnailFile,
      "project-thumbnails",
    );

    if (!thumbnailURL) {
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "Failed to upload thumbnail",
      );
    }

    for (const asset of assets) {
      const assetURL = await this.storageService.uploadFile(
        asset,
        "project-assets",
      );
      if (!assetURL) {
        throw new AppError(ErrorCode.DATABASE_ERROR, "Failed to upload asset");
      }
      assetURLs.push(assetURL);
    }

    const assetsURLString = assetURLs.join(",");
    const techStackString = techStacks.join(",");

    const createdProject = await this.projectRepository.createProject( 
    {
      ...projectFields,
      thumbnailURL: thumbnailURL,
      assetsURL: assetsURLString,
      techStacks: techStackString,
      createdBy: userID || 0,
      updatedBy: userID || 0,
    }
    );

    const projectTagsData = Array.from(new Set(tagsID)).map((tagID) => ({
      projectID: createdProject.id,
      tagID,
      createdBy: userID || 0,
      updatedBy: userID || 0,
    }));

    const projectMembersData = members.map((member) => ({
      projectID: createdProject.id,
      userID: member.userID,
      roleID: member.roleID,
      createdBy: userID || 0,
      updatedBy: userID || 0,
    }));

    const projectCourseData = Array.from(new Set(coursesID)).map((courseID) => ({
      projectID: createdProject.id,
      courseID,
      createdBy: userID || 0,
      updatedBy: userID || 0,
    }));

    await this.projectRepository.createProjectMember(projectMembersData);

    await this.projectRepository.createProjectTag(projectTagsData);

    await this.projectRepository.createProjectCourse(projectCourseData);

    return this.projectFactory.mapProjectToDTO(createdProject);
  }

  async getProject(query: ProjectQueryParams): Promise<PageableType<typeof ProjectDTO>> {
    const [ProjectList, countProject] = await Promise.all([
      this.projectRepository.getProject(query),
      this.projectRepository.countProject(query),
    ]);

    return {
      rows: this.projectFactory.mapProjectListToDTOList(ProjectList),
      totalRecords: countProject,
      page: query.page || 1,
      pageSize: query.pageSize || 10,
    };
  }

  async getProjectById(id: number): Promise<ProjectDTO | null> {
    try {
      const project = await this.projectRepository.getProjectById(id);
      if (!project) {
        return null;
      }
      return this.projectFactory.mapProjectToDTO(project);
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }
}
