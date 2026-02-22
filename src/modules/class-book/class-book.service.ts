import { IClassBookFactory } from "./class-book.factory";
import {
  CreateClassBookDTO,
  ClassBookDTO,
  ClassBookQueryParams,
} from "./domain/class-book";
import { IClassBookRepository } from "./domain/class-book.repository";
import { SupabaseService } from "../../core/utils/supabase";
import { AppError } from "../../core/error/app-error";
import { ErrorCode } from "../../core/types/errors";
import { PageableType } from "../../core/models";

interface IClassBookService {
  createClassBook(data: CreateClassBookDTO): Promise<ClassBookDTO>;
  getClassBooks(
    query: ClassBookQueryParams,
  ): Promise<PageableType<typeof ClassBookDTO>>;
  getClassBookById(id: number): Promise<ClassBookDTO | null>;
}

export class ClassBookService implements IClassBookService {
  constructor(
    private readonly classBookRepository: IClassBookRepository,
    private readonly classBookFactory: IClassBookFactory,
    private readonly storage: SupabaseService,
  ) {}

  async createClassBook(data: CreateClassBookDTO): Promise<ClassBookDTO> {
    const { thumbnailFile, ...rest } = data;
    try {
      let thumbnailPath: string | null = null;
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

  async getClassBooks(
    query: ClassBookQueryParams,
  ): Promise<PageableType<typeof ClassBookDTO>> {
    const [classBooks, totalRecords] = await Promise.all([
      this.classBookRepository.getClassBooks(query),
      this.classBookRepository.countClassBooks(query),
    ]);

    return {
      rows: this.classBookFactory.mapClassBookListToDTO(classBooks),
      totalRecords,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 10,
    };
  }

  async getClassBookById(id: number): Promise<ClassBookDTO | null> {
    const classBook = await this.classBookRepository.getClassBookById(id);
    if (!classBook) {
      return null;
    }
    return this.classBookFactory.mapClassBookToDTO(classBook);
  }
}
