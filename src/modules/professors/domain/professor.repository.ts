import { Prisma } from "../../../generated/prisma/client";
import { Professor } from "./professor";

export interface IProfessorRepository {
  createProfessor(data: Prisma.ProfessorCreateInput): Promise<Professor>;
}
