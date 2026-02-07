import { Prisma } from "../../../generated/prisma/client";
import { News } from "./news";

export interface INewsRepository {
  createNews(data: Prisma.NewsUncheckedCreateInput): Promise<News>;
}
