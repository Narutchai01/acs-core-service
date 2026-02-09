import { IProfessorRepository } from "../modules/professors/domain/professor.repository";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { Professor } from "../modules/professors/domain/professor";

export class ProfessorRepository implements IProfessorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createProfessor(data: Prisma.ProfessorCreateInput): Promise<Professor> {
    const professor = await this.prisma.professor.create({
      data,
      include: {
        user: true,
      },
    });
    return professor as Professor;
  }
}
