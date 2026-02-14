import { Prisma } from "../../../generated/prisma/client";
import { News, NewsQueryParams, NewsFeature } from "./news";

export interface INewsRepository {
  createNews(data: Prisma.NewsUncheckedCreateInput): Promise<News>;
  getNews(query: NewsQueryParams): Promise<News[]>;
  getNewsById(id: number): Promise<News | null>;
  upsertNewsFeature(
    newsFeatureData: Prisma.NewsFeaturesUncheckedCreateInput,
  ): Promise<NewsFeature>;
}
