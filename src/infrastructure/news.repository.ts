import { PrismaClient, Prisma } from "../generated/prisma/client";
import { INewsRepository } from "../modules/news/domain/news.repository";
import { News } from "../modules/news/domain/news";
import { AppError } from "../core/error/app-error";
import { ErrorCode } from "../core/types/errors";

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

  async getNews(): Promise<News[]> {
    const newsList = await this.prisma.news.findMany({
      include: {
        tag: false,
      },
    });
    return newsList;
  }

  async getNewsById(id: number): Promise<News | null> {
    try {
      const news = await this.prisma.news.findUnique({
        where: { id },
        include: {
          tag: true,
        },
      });
      return news;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new AppError(ErrorCode.NOT_FOUND_ERROR, "News not found", 404);
        }
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "Database error occurred",
        500,
      );
    }
  }
}
