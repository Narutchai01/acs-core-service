import { PrismaClient, Prisma } from "../generated/prisma/client";
import { INewsRepository } from "../modules/news/domain/news.repository";
import {
  News,
  NewsFeature,
  NewsQueryParams,
  QueryNewsFeatureParams,
} from "../modules/news/domain/news";
import { AppError } from "../core/error/app-error";
import { ErrorCode } from "../core/types/errors";
import { calculatePagination } from "../core/utils/calculator";
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

  async getNews(query: NewsQueryParams): Promise<News[]> {
    const { page = 1, pageSize = 10, orderBy = "createdAt", sortBy } = query;
    const newsList = await this.prisma.news.findMany({
      skip: calculatePagination(page, pageSize),
      take: pageSize,
      orderBy: {
        [orderBy]: sortBy,
      },
      where: {
        ...(query.tagID && { tagID: query.tagID }),
        deletedAt: null,
      },
      include: {
        tag: false,
      },
    });
    return newsList;
  }

  async getNewsById(id: number): Promise<News | null> {
    try {
      const news = await this.prisma.news.findUnique({
        where: { id, deletedAt: null },
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

  async upsertNewsFeature(
    newsFeatureData: Prisma.NewsFeaturesUncheckedCreateInput,
  ): Promise<NewsFeature> {
    const newsFeature = await this.prisma.newsFeatures.upsert({
      where: {
        newsID_tagID: {
          newsID: newsFeatureData.newsID,
          tagID: newsFeatureData.tagID,
        },
      },
      update: {
        thumbnailURL: newsFeatureData.thumbnailURL,
        updatedBy: newsFeatureData.updatedBy,
      },
      create: newsFeatureData,
      include: {
        news: {
          include: {
            tag: true,
          },
        },
      },
    });
    return newsFeature;
  }

  async getNewsFeaturesBy(
    query: QueryNewsFeatureParams,
  ): Promise<NewsFeature[]> {
    const newsFeatures = await this.prisma.newsFeatures.findMany({
      where: {
        ...(query.tagID && { tagID: query.tagID }),
        deletedAt: null,
      },
      include: {
        news: {
          include: {
            tag: true,
          },
        },
      },
    });
    return newsFeatures;
  }
}
