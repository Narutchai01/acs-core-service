import { SupabaseService } from "../../core/utils/supabase";
import { CreateNewsDTO, NewsDTO } from "./domain/news";
import { INewsRepository } from "./domain/news.repository";
import { NewsFactory } from "./news.factory";

interface INewsService {
  createNews(data: CreateNewsDTO): Promise<NewsDTO>;
  getNews(): Promise<NewsDTO[]>;
}

export class NewsService implements INewsService {
  constructor(
    private readonly newsRepository: INewsRepository,
    private readonly newsFactory: NewsFactory,
    private readonly storageService: SupabaseService,
  ) {}

  async createNews(data: CreateNewsDTO): Promise<NewsDTO> {
    const image = data.image;
    if (!image) {
      throw new Error("Image is required");
    }

    const imageURL = await this.storageService.uploadFile(image, "news");

    // Get public URL of the uploaded image
    const newsData = {
      ...data,
      image: imageURL,
      createdBy: 0,
      updatedBy: 0,
    };
    const news = await this.newsRepository.createNews(newsData);
    return this.newsFactory.mapNewsToDTO(news);
  }

  async getNews(): Promise<NewsDTO[]> {
    const newsList = await this.newsRepository.getNews();
    const newsDTOList = this.newsFactory.mapNewsListToDTO(newsList);
    return newsDTOList;
  }
}
