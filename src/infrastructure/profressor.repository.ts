import { IProfessorRepository } from "../modules/professors/domain/professor.repository";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import {
  Professor,
  ProfessorQueryParams,
} from "../modules/professors/domain/professor";
import { calculatePagination } from "../core/utils/calculator";
import { AppError } from "../core/error/app-error";
import { ErrorCode } from "../core/types/errors";
import { HttpStatusCode } from "../core/types/http";

export class ProfessorRepository implements IProfessorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createProfessor(
    data: Prisma.ProfessorUncheckedCreateInput,
  ): Promise<Professor> {
    const professor = await this.prisma.professor.create({
      data,
      include: {
        user: true,
        academicPosition: true,
      },
    });
    return professor as unknown as Professor;
  }

  async getProfessors(query: ProfessorQueryParams): Promise<Professor[]> {
    const {
      page = 1,
      pageSize = 10,
      orderBy = "createdAt",
      sortBy = "asc",
      academicPosition,
    } = query;

    const professors = await this.prisma.professor.findMany({
      skip: calculatePagination(page, pageSize),
      take: pageSize,
      orderBy: {
        [orderBy]: sortBy,
      },
      where: {
        deletedAt: null,
      },
      include: {
        user: true,
        academicPosition: academicPosition,
      },
    });
    return professors as unknown as Professor[];
  }

  async getProfessorById(id: number): Promise<Professor | null> {
    try {
      const professor = await this.prisma.professor.findUnique({
        where: { id, deletedAt: null },
        include: {
          user: true,
          academicPosition: true,
        },
      });
      return professor as Professor | null;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return null;
        }
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "Database error occurred",
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProfessor(
    professorID: number,
    data: Prisma.ProfessorUncheckedUpdateInput,
  ): Promise<Professor> {
    const professor = await this.prisma.professor.update({
      where: { id: professorID },
      data,
      include: {
        user: true,
        academicPosition: true,
      },
    });
    return professor as unknown as Professor;
  }

  // async assignEducation(
  //   data: Prisma.EducationUncheckedCreateInput,
  // ): Promise<Education> {
  //   const education = await this.prisma.education.create({
  //     data,
  //   });
  //   return education;
  // }
}
