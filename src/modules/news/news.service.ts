import { News, CreateNewsDTO } from "./domain/news";
import { INewsRepository } from "./domain/news.repository";

interface INewsService {
  createNews(data: CreateNewsDTO): Promise<News>;
}

export class NewsService implements INewsService {
  constructor(private readonly newsRepository: INewsRepository) {}

  async createNews(data: CreateNewsDTO): Promise<News> {
    const newsData = {
      ...data,
      image: "placeholder.jpg",
      createdBy: 0,
      updatedBy: 0,
    };
    return this.newsRepository.createNews(newsData);
  }
}
