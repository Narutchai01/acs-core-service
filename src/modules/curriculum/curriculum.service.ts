import {
  CreateCurriculumDTO,
  CurriculumDTO,
  CurriculumQueryParams,
} from "./domain/curriculum";
import { ICurriculumRepository } from "./domain/curriculum.repository";
import { SupabaseService } from "../../core/utils/supabase";
import { AppError } from "../../core/error/app-error";
import { ErrorCode } from "../../core/types/errors";
import { HttpStatusCode } from "../../core/types/http";
import { ICurriculumFactory } from "./curriculum.factory";

interface ICurriculumService {
  createCurriculum(data: CreateCurriculumDTO): Promise<CurriculumDTO>;
  getCurriculums(querry: CurriculumQueryParams): Promise<CurriculumDTO[]>;
}

export class CurriculumService implements ICurriculumService {
  constructor(
    private readonly curriculumRepository: ICurriculumRepository,
    private readonly curriculumFactory: ICurriculumFactory,
    private readonly storageService: SupabaseService,
  ) {}

  async createCurriculum(data: CreateCurriculumDTO): Promise<CurriculumDTO> {
    const { thumbnailFile, ...rest } = data;
    let uploadedThumbnailPath: string | null = null;
    try {
      if (!thumbnailFile) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          "Thumbnail file is required",
          HttpStatusCode.BAD_REQUEST,
        );
      }

      uploadedThumbnailPath = await this.storageService.uploadFile(
        thumbnailFile,
        "curriculums",
      );

      const curriculumData = {
        ...rest,
        thumbnailURL: uploadedThumbnailPath,
        createdBy: 0,
        updatedBy: 0,
      };

      const curriculum =
        await this.curriculumRepository.createCurriculum(curriculumData);

      return this.curriculumFactory.mapCurriculumToDTO(curriculum);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCurriculums(
    querry: CurriculumQueryParams,
  ): Promise<CurriculumDTO[]> {
    const curriculums = await this.curriculumRepository.getCurriculums(querry);
    return this.curriculumFactory.mapCurriculumsToDTOs(curriculums);
  }
}
