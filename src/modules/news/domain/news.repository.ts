import { Prisma } from "../../../generated/prisma/client";
import { News } from "./news";

export interface INewsRepository {
  createNews(data: Prisma.NewsUncheckedCreateInput): Promise<News>;
  getNews(): Promise<News[]>;
  getNewsById(id: number): Promise<News | null>;
}
