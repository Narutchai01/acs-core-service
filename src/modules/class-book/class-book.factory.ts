import { ClassBook, ClassBookDTO } from "./domain/class-book";

export interface IClassBookFactory {
  mapClassBookToDTO(classBook: ClassBook): ClassBookDTO;
  mapClassBookListToDTO(classBooks: ClassBook[]): ClassBookDTO[];
}

export class ClassBookFactory implements IClassBookFactory {
  mapClassBookToDTO(classBook: ClassBook): ClassBookDTO {
    return { ...classBook };
  }
  mapClassBookListToDTO(classBooks: ClassBook[]): ClassBookDTO[] {
    return classBooks.map((classBook) => this.mapClassBookToDTO(classBook));
  }
}
