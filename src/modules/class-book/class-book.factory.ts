import { ClassBook, ClassBookDTO } from "./domain/class-book";

export interface IClassBookFactory {
  mapClassBookToDTO(classBook: ClassBook): ClassBookDTO;
  mapClassBookListToDTO(classBooks: ClassBook[]): ClassBookDTO[];
}

export class ClassBookFactory implements IClassBookFactory {
  mapClassBookToDTO(classBook: ClassBook): ClassBookDTO {
    return {
      id: classBook.id,
      thumbnailURL: classBook.thumbnailURL,
      classof: classBook.classof,
      firstYearAcademic: classBook.firstYearAcademic,
    };
  }
  mapClassBookListToDTO(classBooks: ClassBook[]): ClassBookDTO[] {
    return classBooks.map((classBook) => this.mapClassBookToDTO(classBook));
  }
}
