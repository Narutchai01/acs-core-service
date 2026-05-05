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
    return {
      ...news,
      tag: news.tag
        ? {
            ...news.tag,
            tagsGroupsId: news.tag.tageGroupsId,
            // Remove the incorrect property if present
            // Optionally: ...news.tag without 'tageGroupsId'
          }
        : undefined,
    };
  }

  async getNews(query: NewsQueryParams): Promise<News[]> {
    const {
      page = 1,
      pageSize = 10,
      orderBy = "createdAt",
      sortBy,
      search,
      searchBy,
    } = query;
    const newsList = await this.prisma.news.findMany({
      skip: calculatePagination(page, pageSize),
      take: pageSize,
      orderBy: {
        [orderBy]: sortBy,
      },
      where: {
        ...(query.tagID && { tagID: query.tagID }),
        ...(search &&
          searchBy && {
            [searchBy]: { contains: search, mode: "insensitive" },
          }),
        deletedAt: null,
      },
      include: {
        tag: true,
      },
    });
    return newsList.map((news) => ({
      ...news,
      tag: news.tag
        ? {
            ...news.tag,
            tagsGroupsId: news.tag.tageGroupsId,
          }
        : undefined,
    }));
  }

  async getNewsById(id: number): Promise<News | null> {
    try {
      const news = await this.prisma.news.findUnique({
        where: { id, deletedAt: null },
        include: {
          tag: true,
        },
      });
      if (!news) return null;
      return {
        ...news,
        tag: news.tag
          ? {
              ...news.tag,
              tagsGroupsId: news.tag.tageGroupsId,
            }
          : undefined,
      };
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
    return {
      ...newsFeature,
      news: {
        ...newsFeature.news,
        tag: newsFeature.news.tag
          ? {
              ...newsFeature.news.tag,
              tagsGroupsId: newsFeature.news.tag.tageGroupsId,
            }
          : undefined,
      },
    };
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
    return newsFeatures.map((newsFeature) => ({
      ...newsFeature,
      news: {
        ...newsFeature.news,
        tag: newsFeature.news.tag
          ? {
              ...newsFeature.news.tag,
              tagsGroupsId: newsFeature.news.tag.tageGroupsId,
            }
          : undefined,
      },
    }));
  }

  async getNewsFeatureById(id: number): Promise<NewsFeature | null> {
    try {
      const newsFeature = await this.prisma.newsFeatures.findUnique({
        where: { id, deletedAt: null },
        include: {
          news: {
            include: {
              tag: true,
            },
          },
        },
      });
      if (!newsFeature) {
        return null;
      }
      return {
        ...newsFeature,
        news: {
          ...newsFeature.news,
          tag: newsFeature.news.tag
            ? {
                ...newsFeature.news.tag,
                tagsGroupsId: newsFeature.news.tag.tageGroupsId,
              }
            : undefined,
        },
      };
    } catch (error) {
      return null;
    }
  }

  async countNews(query: NewsQueryParams): Promise<number> {
    const count = await this.prisma.news.count({
      where: {
        ...(query.tagID && { tagID: query.tagID }),
        deletedAt: null,
      },
    });
    return count;
  }

  async countNewsFeatures(query: QueryNewsFeatureParams): Promise<number> {
    const count = await this.prisma.newsFeatures.count({
      where: {
        ...(query.tagID && { tagID: query.tagID }),
        deletedAt: null,
      },
    });
    return count;
  }

  async deleteNews(id: number): Promise<News | null> {
    try {
      const news = await this.prisma.news.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
        include: {
          tag: true,
        },
      });
      return {
        ...news,
        tag: news.tag
          ? {
              ...news.tag,
              tagsGroupsId: news.tag.tageGroupsId,
            }
          : undefined,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return null;
        }
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "Database error occurred",
        500,
      );
    }
  }

  async updateNews(
    newsID: number,
    data: Prisma.NewsUncheckedUpdateInput,
  ): Promise<News | null> {
    try {
      const news = await this.prisma.news.update({
        where: { id: newsID },
        data,
        include: {
          tag: true,
        },
      });
      return {
        ...news,
        tag: news.tag
          ? {
              ...news.tag,
              tagsGroupsId: news.tag.tageGroupsId,
            }
          : undefined,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return null;
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
