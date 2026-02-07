import { PrismaClient, Prisma } from "../generated/prisma/client";
import { INewsRepository } from "../modules/news/domain/news.repository";
import { News } from "../modules/news/domain/news";

export class NewsRepository implements INewsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createNews(data: Prisma.NewsUncheckedCreateInput): Promise<News> {
    const news = await this.prisma.news.create({
      data,
      include: {
        tag: true,
      },
    });
    return news;
  }
}
