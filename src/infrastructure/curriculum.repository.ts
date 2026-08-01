import { ICurriculumRepository } from "../modules/curriculums/domain/curriculum.repository";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import {
  Curriculum,
  CurriculumQueryParams,
  CurriculumCreatePayload,
  CurriculumUpdatePayload
} from "../modules/curriculums/domain/curriculum";

import { calculatePagination } from "../core/utils/calculator";
import { AppError } from "../core/error/app-error";
import { ErrorCode } from "../core/types/errors";
import { PrismaInstance } from "../lib/db";

export class CurriculumRepository implements ICurriculumRepository {
  constructor(private readonly db: PrismaInstance) {}

  async createCurriculum(
    data: CurriculumCreatePayload,
  ): Promise<Curriculum> {
    const curriculum = await this.db.curriculum.create({
      data,
    });
    return curriculum;
  }

  async getCurriculums(query: CurriculumQueryParams): Promise<Curriculum[]> {
    const { page = 1, pageSize = 10, orderBy = "createdAt", sortBy } = query;
    const curriculums = await this.db.curriculum.findMany({
      skip: calculatePagination(page, pageSize),
      take: pageSize,
      where: {
        deletedAt: null,
        ...(query.year && { year: query.year }),
      },
      orderBy: {
        [orderBy]: sortBy,
      },
    });
    return curriculums;
  }

  async countCurriculums(query: CurriculumQueryParams): Promise<number> {
    const count = await this.db.curriculum.count({
      where: {
        ...(query.year && { year: query.year }),
        deletedAt: null,
      },
    });
    return count;
  }

  async getCurriculumById(id: number): Promise<Curriculum | null> {
    const curriculum = await this.db.curriculum.findFirst({
      where: {
        id: id,
        deletedAt: null,
      },
    });
    return curriculum;
  }

  async updateCurriculum(
    id: number,
    data: CurriculumUpdatePayload,
  ): Promise<Curriculum> {
    const curriculum = await this.db.curriculum.update({
      where: {
        id: id,
      },
      data,
    });
    return curriculum;
  }

  async deleteCurriculum(id: number): Promise<Curriculum> {
    try {
      const curriculum = await this.db.curriculum.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
      return curriculum;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new AppError(
            ErrorCode.NOT_FOUND_ERROR,
            "Curriculum not found",
            404,
          );
        }
      }
      throw error; 
    }
  }
}