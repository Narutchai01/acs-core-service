import { AppError } from "../../core/error/app-error";
import { ErrorCode } from "../../core/types/errors";
import { HttpStatusCode } from "../../core/types/http";
import { SupabaseService } from "../../core/utils/supabase";
import { Prisma } from "../../generated/prisma/client";
import {
  CreateNewsDTO,
  NewsDTO,
  NewsQueryParams,
  NewsFeatureDTO,
  UpsertNewsFeatureDTO,
  QueryNewsFeatureParams,
  NewsUpdateDTO,
  News,
} from "./domain/news";
import { INewsRepository } from "./domain/news.repository";
import { NewsFactory } from "./news.factory";
import { PageableType } from "../../core/models";

interface INewsService {
  createNews(data: CreateNewsDTO): Promise<NewsDTO>;
  getNews(query: NewsQueryParams): Promise<PageableType<typeof NewsDTO>>;
  getNewsById(id: number): Promise<NewsDTO | null>;
  upsertNewsFeature(data: UpsertNewsFeatureDTO): Promise<NewsFeatureDTO>;
  getNewsFeatures(
    query: QueryNewsFeatureParams,
  ): Promise<PageableType<typeof NewsFeatureDTO>>;
  getNewsFeatureById(id: number): Promise<NewsFeatureDTO | null>;
}

export class NewsService implements INewsService {
  constructor(
    private readonly newsRepository: INewsRepository,
    private readonly newsFactory: NewsFactory,
    private readonly storageService: SupabaseService,
  ) {}
  async createNews(data: CreateNewsDTO): Promise<NewsDTO> {
    const thumbnailFile = data.thumbnail;
    const highlightFile = data.highlight;
    let uploadedThumbnailPath: string | null = null; // เก็บ path ไว้ลบทีหลัง
    let uploadedHighlightPath: string | null = null; // เก็บ path ไว้ลบทีหลัง
    try {
      if (!thumbnailFile || !highlightFile) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          "Thumbnail and highlight files are required",
          400,
        );
      }

      uploadedThumbnailPath = await this.storageService.uploadFile(
        thumbnailFile,
        "news-thumbnail",
      );
      uploadedHighlightPath = await this.storageService.uploadFile(
        highlightFile,
        "news-highlight",
      );

      const newsData = {
        ...data,
        thumbnail: uploadedThumbnailPath,
        highlight: uploadedHighlightPath,
        createdBy: 0,
        updatedBy: 0,
      };
      const news = await this.newsRepository.createNews(newsData);
      return this.newsFactory.mapNewsToDTO(news);
    } catch (error) {
      if (uploadedThumbnailPath) {
        await this.storageService
          .deleteFile(uploadedThumbnailPath)
          .catch((err) => {
            console.error("🔥 Failed to delete file during rollback:", err);
          });
      }

      if (uploadedHighlightPath) {
        await this.storageService
          .deleteFile(uploadedHighlightPath)
          .catch((err) => {
            console.error("🔥 Failed to delete file during rollback:", err);
          });
      }
      throw error;
    }
  }

  async getNews(query: NewsQueryParams): Promise<PageableType<typeof NewsDTO>> {
    const [newsList, countNews] = await Promise.all([
      this.newsRepository.getNews(query),
      this.newsRepository.countNews(query),
    ]);

    return {
      rows: this.newsFactory.mapNewsListToDTO(newsList),
      totalRecords: countNews,
      page: query.page || 1,
      pageSize: query.pageSize || 10,
    };
  }

  async getNewsById(id: number): Promise<NewsDTO | null> {
    try {
      const news = await this.newsRepository.getNewsById(id);

      if (!news) {
        return null;
      }
      return this.newsFactory.mapNewsToDTO(news);
    } catch (error) {
      if (
        error instanceof AppError &&
        error.statusCode === HttpStatusCode.NOT_FOUND
      ) {
        return null;
      }
      throw error;
    }
  }

  async upsertNewsFeature(data: UpsertNewsFeatureDTO): Promise<NewsFeatureDTO> {
    try {
      const { thumbnail, ...rest } = data;
      let uploadedThumbnailPath: string | null = null;

      if (!thumbnail) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          "Thumbnail file is required",
          400,
        );
      }
      uploadedThumbnailPath = await this.storageService.uploadFile(
        thumbnail,
        "news-features",
      );

      const newsFeatureData: Prisma.NewsFeaturesUncheckedCreateInput = {
        ...rest,
        thumbnailURL: uploadedThumbnailPath,
        createdBy: 0,
        updatedBy: 0,
      };

      const newsFeature =
        await this.newsRepository.upsertNewsFeature(newsFeatureData);
      return this.newsFactory.mapNewsFeatureToDTO(newsFeature);
    } catch (error) {
      console.error("🔥 Error in upsertNewsFeature:", error);

      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "Failed to upsert news feature",
        500,
      );
    }
  }

  async getNewsFeatures(
    query: QueryNewsFeatureParams,
  ): Promise<PageableType<typeof NewsFeatureDTO>> {
    const [newsFeatures, countNewsFeatures] = await Promise.all([
      this.newsRepository.getNewsFeaturesBy(query),
      this.newsRepository.countNewsFeatures(query),
    ]);

    return {
      rows: this.newsFactory.mapNewsFeatureListToDTO(newsFeatures),
      totalRecords: countNewsFeatures,
      page: query.page || 1,
      pageSize: query.pageSize || 10,
    };
  }

  async getNewsFeatureById(id: number): Promise<NewsFeatureDTO | null> {
    try {
      const newsFeature = await this.newsRepository.getNewsFeatureById(id);

      if (!newsFeature) {
        return null;
      }
      return this.newsFactory.mapNewsFeatureToDTO(newsFeature);
    } catch (error) {
      if (
        error instanceof AppError &&
        error.statusCode === HttpStatusCode.NOT_FOUND
      ) {
        return null;
      }
      throw error;
    }
  }

  async deleteNews(id: number): Promise<NewsDTO | null> {
    const news = await this.newsRepository.deleteNews(id);
    if (!news) {
      throw new AppError(
        ErrorCode.NOT_FOUND_ERROR,
        "News not found",
        HttpStatusCode.NOT_FOUND,
      );
    }
    return this.newsFactory.mapNewsToDTO(news);
  }

  async updateNews(
    newsID: number,
    data: NewsUpdateDTO,
    userID: number,
  ): Promise<NewsDTO> {
    const { thumbnail, highlight, ...newsData } = data;
    let thumbnailPath: string | undefined = undefined;
    let highlightPath: string | undefined = undefined;

    try {
      if (thumbnail) {
        thumbnailPath = await this.storageService.uploadFile(
          thumbnail,
          "news-thumbnail",
        );
      }
      if (highlight) {
        highlightPath = await this.storageService.uploadFile(
          highlight,
          "news-highlight",
        );
      }
      const updateNewsData: Prisma.NewsUncheckedUpdateInput = {
        ...(thumbnail && { thumbnail: thumbnailPath }),
        ...(highlight && { highlight: highlightPath }),
        ...newsData,
        updatedBy: userID,
        updatedAt: new Date(),
      };

      const news = await this.newsRepository.updateNews(newsID, updateNewsData);

      if (!news) {
        throw new AppError(
          ErrorCode.NOT_FOUND_ERROR,
          "News not found",
          HttpStatusCode.NOT_FOUND,
        );
      }
      return this.newsFactory.mapNewsToDTO(news);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
