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
import { PageableType } from "../../core/models";
interface ICurriculumService {
  createCurriculum(data: CreateCurriculumDTO): Promise<CurriculumDTO>;
  getCurriculums(
    query: CurriculumQueryParams,
  ): Promise<PageableType<typeof CurriculumDTO>>;
}

export class CurriculumService implements ICurriculumService {
  constructor(
    private readonly curriculumRepository: ICurriculumRepository,
    private readonly curriculumFactory: ICurriculumFactory,
    private readonly storageService: SupabaseService,
  ) {}

  async createCurriculum(data: CreateCurriculumDTO): Promise<CurriculumDTO> {
    const { thumbnailFile, ...rest } = data;
    try {
      let uploadedThumbnailPath: string | null = null;
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
    query: CurriculumQueryParams,
  ): Promise<PageableType<typeof CurriculumDTO>> {
    const [curriculums, countCurriculums] = await Promise.all([
      this.curriculumRepository.getCurriculums(query),
      this.curriculumRepository.countCurriculums(query),
    ]);

    return {
      rows: this.curriculumFactory.mapCurriculumsToDTOs(curriculums),
      totalRecords: countCurriculums,
      page: query.page || 1,
      pageSize: query.pageSize || 10,
    };
  }
}
