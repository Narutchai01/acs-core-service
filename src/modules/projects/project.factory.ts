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

      tag: project.projectTags?.map((projectTag: any) => ({
        id: projectTag.tag.id,
        name: projectTag.tag.name,
        tagsGroupsId: projectTag.tag.tageGroupsId,
      })) || [],

      member:
        project.projectMembers?.map((projectMember: any) => ({
        ...this.userFactory.mapUserToDTO(projectMember.user),
        role: {
          id: projectMember.role.id,
          name: projectMember.role.name,
        },
      })) ?? [],

       course: this.courseFactory.mapCourseListToDTO(
        project.projectCourses?.map((projectCourse: any) => projectCourse.course) || []
      ),
      };
  }

  mapProjectListToDTOList(projects: Project[]): ProjectDTO[] {
    return projects.map((project) => this.mapProjectToDTO(project));
  }
}
