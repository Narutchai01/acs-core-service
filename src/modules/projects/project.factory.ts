import { Project, ProjectDTO } from "./domain/project";
import { IUserFactory } from "../users/user.factory";
import { ICourseFactory } from "../courses/course.factory";
export interface IProjectFactory {
  mapProjectToDTO(project: Project): ProjectDTO;
  mapProjectListToDTOList(projects: Project[]): ProjectDTO[];
}

export class ProjectFactory implements IProjectFactory {
  constructor(
    private readonly userFactory: IUserFactory,
    private readonly courseFactory: ICourseFactory,
  ) {}
  mapProjectToDTO(project: Project): ProjectDTO {
    return {
      id: project.id,
      thumbnailURL: project.thumbnailURL,
      title: project.title,
      details: project.details,
      githubURL: project.githubURL,
      presentationURL: project.presentationURL,
      documentURL: project.documentURL,
      figmaURL: project.figmaURL,
      youtubeURL: project.youtubeURL,
      assetsURL: project.assetsURL ? project.assetsURL.split(",") : [],
      techStacks: project.techStacks ? project.techStacks.split(",") : [],

      tag: project.projectTags?.map((pt: any) => ({
        id: pt.tag.id,
        name: pt.tag.name,
        tagsGroupsId: pt.tag.tageGroupsId,
      })) || [],

      member:
        project.projectMembers?.map((pm: any) => ({
        ...this.userFactory.mapUserToDTO(pm.user),
        role: {
          id: pm.role.id,
          name: pm.role.name,
        },
      })) ?? [],

       course: this.courseFactory.mapCourseListToDTO(
        project.projectCourses?.map((pc: any) => pc.course) ?? []
      ),
      };
  }

  mapProjectListToDTOList(projects: Project[]): ProjectDTO[] {
    return projects.map((project) => this.mapProjectToDTO(project));
  }
}
