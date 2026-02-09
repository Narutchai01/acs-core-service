import { Prisma } from "../../../generated/prisma/client";
import { Curriculum } from "./curriculum";

export interface ICurriculumRepository {
  createCurriculum(data: Prisma.CurriculumCreateInput): Promise<Curriculum>;
}
