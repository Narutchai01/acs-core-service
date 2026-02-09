import { ICurriculumRepository } from "../modules/curriculums/domain/curriculum.repository";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import {
  Curriculum,
  CurriculumQueryParams,
} from "../modules/curriculums/domain/curriculum";
import { calculatePagination } from "../core/utils/calculator";

export class CurriculumRepository implements ICurriculumRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createCurriculum(
    data: Prisma.CurriculumCreateInput,
  ): Promise<Curriculum> {
    const curriculum = await this.prisma.curriculum.create({
      data,
    });
    return curriculum;
  }

  async getCurriculums(query: CurriculumQueryParams): Promise<Curriculum[]> {
    const { page = 1, pageSize = 10, orderBy = "createdAt", sortBy } = query;
    const curriculums = await this.prisma.curriculum.findMany({
      skip: calculatePagination(page, pageSize),
      take: pageSize,
      where: {
        deletedAt: null,
      },
      orderBy: {
        [orderBy]: sortBy,
      },
    });
    return curriculums;
  }
}
