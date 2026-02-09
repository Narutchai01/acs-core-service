import { ProfessorDTO, Professor } from "./domain/professor";

export interface IProfessorFactory {
  mapProfessorToDTO(professor: Professor): ProfessorDTO;
  mapPrfessorListToDTO(professors: Professor[]): ProfessorDTO[];
}

export class ProfessorFactory implements IProfessorFactory {
  mapProfessorToDTO(professor: Professor): ProfessorDTO {
    return {
      id: professor.id,
      profRoom: professor.profRoom,
      user: professor.user,
      phone: professor.phone,
      expertFields: professor.expertFields
        ? professor.expertFields.split(",").map((field) => field.trim())
        : [],
    };
  }

  mapPrfessorListToDTO(professors: Professor[]): ProfessorDTO[] {
    return professors.map((professor) => this.mapProfessorToDTO(professor));
  }
}
