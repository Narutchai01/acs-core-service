import { IClassBookFactory } from "./class-book.factory";
import {
  CreateClassBookDTO,
  ClassBookDTO,
  ClassBookQueryParams,
  UpdateClassBookDTO,
  ClassBook,
} from "./domain/class-book";
import { IClassBookRepository } from "./domain/class-book.repository";
import { SupabaseService } from "../../core/utils/supabase";
import { AppError } from "../../core/error/app-error";
import { ErrorCode } from "../../core/types/errors";
import { PageableType } from "../../core/models";
import { Prisma } from "../../generated/prisma/client";

interface IClassBookService {
  createClassBook(data: CreateClassBookDTO, createdBy: number): Promise<ClassBookDTO>;
  getClassBooks(
    query: ClassBookQueryParams,
  ): Promise<PageableType<typeof ClassBookDTO>>;
  getClassBookById(id: number): Promise<ClassBookDTO | null>;
  updateClassBook(classBookID: number, data: UpdateClassBookDTO, userID: number): Promise<ClassBookDTO>;
}

export class ClassBookService implements IClassBookService {
  constructor(
    private readonly classBookRepository: IClassBookRepository,
    private readonly classBookFactory: IClassBookFactory,
    private readonly storage: SupabaseService,
  ) { }

  async createClassBook(data: CreateClassBookDTO, createdBy: number): Promise<ClassBookDTO> {
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
        createdBy: createdBy || 0,
        updatedBy: createdBy || 0,
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
  async updateClassBook(classBookID: number, data: UpdateClassBookDTO, userID: number): Promise<ClassBookDTO> {
    const {
      thumbnailFile,
      classof,
      firstYearAcademic,
      curriculumID,

    } = data;
    let thumbnailPath: string | undefined = undefined;
    let classBook: ClassBook;
    try {

      if (thumbnailFile) {
        thumbnailPath = await this.storage.uploadFile(thumbnailFile, "class-books");
      }

      const updateClassBookData: Prisma.ClassBookUncheckedUpdateInput = {
        ...(thumbnailPath && { thumbnailURL: thumbnailPath }),
        classof,
        firstYearAcademic,
        curriculumID,
        updatedBy: userID,
      };

      classBook = await this.classBookRepository.updateClassBook(classBookID, updateClassBookData);
      return this.classBookFactory.mapClassBookToDTO(classBook);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
