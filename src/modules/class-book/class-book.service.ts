import { IClassBookFactory } from "./class-book.factory";
import { CreateClassBookDTO, ClassBookDTO } from "./domain/class-book";
import { IClassBookRepository } from "./domain/class-book.repository";
import { SupabaseService } from "../../core/utils/supabase";
import { AppError } from "../../core/error/app-error";
import { ErrorCode } from "../../core/types/errors";

interface IClassBookService {
  createClassBook(data: CreateClassBookDTO): Promise<ClassBookDTO>;
}

export class ClassBookService implements IClassBookService {
  constructor(
    private readonly classBookRepository: IClassBookRepository,
    private readonly classBookFactory: IClassBookFactory,
    private readonly storage: SupabaseService,
  ) {}

  async createClassBook(data: CreateClassBookDTO): Promise<ClassBookDTO> {
    const { thumbnailFile, ...rest } = data;
    let thumbnailPath: string | null = null;
    try {
      if (!thumbnailFile) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          "Thumbnail file is required",
          400,
        );
      }

      thumbnailPath = await this.storage.uploadFile(
        thumbnailFile,
        "class-books",
      );

      const classBookData = {
        ...rest,
        thumbnailURL: thumbnailPath,
        createdBy: 0,
        updatedBy: 0,
      };

      const classBook =
        await this.classBookRepository.createClassBook(classBookData);
      return this.classBookFactory.mapClassBookToDTO(classBook);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
