import { AppError } from "../../core/error/app-error";
import { ErrorCode } from "../../core/types/errors";
import { HttpStatusCode } from "../../core/types/http";
import { SupabaseService } from "../../core/utils/supabase";
import { CreateNewsDTO, NewsDTO } from "./domain/news";
import { INewsRepository } from "./domain/news.repository";
import { NewsFactory } from "./news.factory";

interface INewsService {
  createNews(data: CreateNewsDTO): Promise<NewsDTO>;
  getNews(): Promise<NewsDTO[]>;
  getNewsById(id: number): Promise<NewsDTO | null>;
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

  async getNews(): Promise<NewsDTO[]> {
    const newsList = await this.newsRepository.getNews();
    if (!newsList || newsList.length === 0) {
      return [];
    }
    return this.newsFactory.mapNewsListToDTO(newsList);
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
}
