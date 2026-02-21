import { Project, ProjectDTO } from "./domain/project";
export interface IProjectFactory {
  mapProjectToDTO(project: Project): ProjectDTO;
  mapProejctListToDTOList(projects: Project[]): ProjectDTO[];
}

export class ProjectFactory implements IProjectFactory {
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
    };
  }

  mapProejctListToDTOList(projects: Project[]): ProjectDTO[] {
    return projects.map((project) => this.mapProjectToDTO(project));
  }
}
