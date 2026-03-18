import { IProjectRepository } from "./domain/project.repository";
import { CreateProjectDTO, ProjectDTO } from "./domain/project";
import { SupabaseService } from "../../core/utils/supabase";
import { AppError } from "../../core/error/app-error";
import { ErrorCode } from "../../core/types/errors";
import { IProjectFactory } from "./project.factory";

interface IProjectService {
  createProject(projectData: CreateProjectDTO): Promise<ProjectDTO>;
  getProjectById(id: number): Promise<ProjectDTO | null>;
}

export class ProjectService implements IProjectService {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly storageService: SupabaseService,
    private readonly projectFactory: IProjectFactory,
  ) {}

  async createProject(projectData: CreateProjectDTO): Promise<ProjectDTO> {
    const {
      thumbnailFile,
      assets,
      tagsID,
      techStacks,
      members,
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

    const createdProject = await this.projectRepository.createProject({
      ...projectFields,
      thumbnailURL: thumbnailURL,
      assetsURL: assetsURLString,
      techStacks: techStackString,
      createdBy: 0,
      updatedBy: 0,
    });

    const projectTagsData = Array.from(new Set(tagsID)).map((tagID) => ({
      projectID: createdProject.id,
      tagID,
      createdBy: 0,
      updatedBy: 0,
    }));

    const projectMembersData = members.map((member) => ({
      projectID: createdProject.id,
      userID: member.userID,
      roleID: member.roleID,
      createdBy: 0,
      updatedBy: 0,
    }));

    await this.projectRepository.createProjectMember(projectMembersData);

    await this.projectRepository.createProjectTag(projectTagsData);

    return this.projectFactory.mapProjectToDTO(createdProject);
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
