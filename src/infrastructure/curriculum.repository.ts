import { ICurriculumRepository } from "../modules/curriculum/domain/curriculum.repository";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { Curriculum } from "../modules/curriculum/domain/curriculum";

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
}
