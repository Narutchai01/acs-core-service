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
    const imageFile = data.image;
    let uploadedImagePath: string | null = null; // เก็บ path ไว้ลบทีหลัง
    try {
      if (!imageFile) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          "Image file is required",
          400,
        );
      }

      uploadedImagePath = await this.storageService.uploadFile(
        imageFile,
        "news",
      );

      const newsData = {
        ...data,
        image: uploadedImagePath,
        createdBy: 0,
        updatedBy: 0,
      };
      const news = await this.newsRepository.createNews(newsData);
      return this.newsFactory.mapNewsToDTO(news);
    } catch (error) {
      if (uploadedImagePath) {
        console.log("⚠️ Rolling back: Deleting uploaded image...");
        await this.storageService.deleteFile(uploadedImagePath).catch((err) => {
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
}
