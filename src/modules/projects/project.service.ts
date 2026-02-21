import { IProjectRepository } from "./domain/project.repository";
import { CreateProjectDTO, ProjectDTO } from "./domain/project";
import { SupabaseService } from "../../core/utils/supabase";
import { AppError } from "../../core/error/app-error";
import { ErrorCode } from "../../core/types/errors";
import { IProjectFactory } from "./project.factory";

interface IProjectService {
  createProject(projectData: CreateProjectDTO): Promise<ProjectDTO>;
}

export class ProjectService implements IProjectService {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly storageService: SupabaseService,
    private readonly projectFactory: IProjectFactory,
  ) {}

  async createProject(projectData: CreateProjectDTO): Promise<ProjectDTO> {
    const { thumbnailFile, tagsID, members, ...projectFields } = projectData;

    if (!thumbnailFile) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        "Thumbnail file is required",
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

    const createdProject = await this.projectRepository.createProject({
      ...projectFields,
      thumbnailURL: thumbnailURL,
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
}
