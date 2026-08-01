import {
  ClassBook,
  ClassBookQueryParams,
  ClassBookCreatePayload,
  ClassBookUpdatePayload,
} from "./class-book";

export interface IClassBookRepository {
  createClassBook(data: ClassBookCreatePayload): Promise<ClassBook>;
  getClassBooks(query: ClassBookQueryParams): Promise<ClassBook[]>;
  getClassBookById(id: number): Promise<ClassBook | null>;
  countClassBooks(query: ClassBookQueryParams): Promise<number>;
  updateClassBook(
    classBookID: number,
    data: ClassBookUpdatePayload,
  ): Promise<ClassBook>;
  deleteClassBook(id: number): Promise<ClassBook>;

}