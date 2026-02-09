import { Prisma } from "../../../generated/prisma/client";
import { Professor, ProfessorQueryParams } from "./professor";

export interface IProfessorRepository {
  createProfessor(data: Prisma.ProfessorCreateInput): Promise<Professor>;
  getProfessors(query: ProfessorQueryParams): Promise<Professor[]>;
}
