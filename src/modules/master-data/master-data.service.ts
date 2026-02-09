import { MasterDataDTO } from "./domain/master-data";
import { IMasterDataRepository } from "./domain/master-data.repository";
interface IMasterDataService {
  getMasterData(): Promise<MasterDataDTO>;
}

export class MasterDataService implements IMasterDataService {
  constructor(private readonly masterDataRepository: IMasterDataRepository) {}
  async getMasterData(): Promise<MasterDataDTO> {
    const [typeCourses, roles, tags, tagsGroups] = await Promise.all([
      this.masterDataRepository.getTypeCourses(),
      this.masterDataRepository.getRoles(),
      this.masterDataRepository.getTags(),
      this.masterDataRepository.getTagGroup(),
    ]);

    return {
      typeCourses,
      roles,
      tags,
      tagsGroups,
    };
  }
}
