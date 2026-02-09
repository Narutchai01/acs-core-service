import { Prisma } from "../../../generated/prisma/client";
import { Curriculum, CurriculumQueryParams } from "./curriculum";

export interface ICurriculumRepository {
  createCurriculum(data: Prisma.CurriculumCreateInput): Promise<Curriculum>;
  getCurriculums(query: CurriculumQueryParams): Promise<Curriculum[]>;
}
