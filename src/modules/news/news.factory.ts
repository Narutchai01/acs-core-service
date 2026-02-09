import { News, NewsDTO } from "./domain/news";

export class NewsFactory {
  mapNewsToDTO(news: News): NewsDTO {
    const { deletedAt, createdAt, createdBy, updatedBy, ...dto } = news; // ตัดทิ้งตรงนี้
    return {
      ...dto,
    };
  }

  mapNewsListToDTO(newsList: News[]): NewsDTO[] {
    return newsList.map((news) => this.mapNewsToDTO(news));
  }
}
