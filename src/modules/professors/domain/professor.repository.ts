import { Prisma } from "../../../generated/prisma/client";
import { Professor, ProfessorQueryParams } from "./professor";

export interface IProfessorRepository {
  createProfessor(
    data: Prisma.ProfessorUncheckedCreateInput,
  ): Promise<Professor>;
  getProfessors(query: ProfessorQueryParams): Promise<Professor[]>;
  getProfessorById(id: number): Promise<Professor | null>;
}
