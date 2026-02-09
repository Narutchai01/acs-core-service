import { IProfessorRepository } from "../modules/professors/domain/professor.repository";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import {
  Professor,
  ProfessorQueryParams,
} from "../modules/professors/domain/professor";
import { calculatePagination } from "../core/utils/calculator";

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

  async getProfessors(query: ProfessorQueryParams): Promise<Professor[]> {
    const {
      page = 1,
      pageSize = 10,
      orderBy = "createdAt",
      sortBy = "asc",
    } = query;

    const professors = await this.prisma.professor.findMany({
      skip: calculatePagination(page, pageSize),
      take: pageSize,
      orderBy: {
        [orderBy]: sortBy,
      },
      include: {
        user: true,
      },
    });
    return professors as Professor[];
  }

  async getProfessorById(id: number): Promise<Professor | null> {
    const professor = await this.prisma.professor.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    return professor as Professor | null;
  }
}
