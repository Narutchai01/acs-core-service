import { News, NewsDTO } from "./domain/news";

export const toNewsDTO = (news: News): NewsDTO => {
  const { tagID, ...dto } = news; // ตัดทิ้งตรงนี้
  return dto;
};

export class NewsFactory {
  mapNewsToDTO(news: News): NewsDTO {
    const { tagID, deletedAt, createdAt, createdBy, updatedBy, ...dto } = news; // ตัดทิ้งตรงนี้
    return dto;
  }

  mapNewsListToDTO(newsList: News[]): NewsDTO[] {
    return newsList.map((news) => this.mapNewsToDTO(news));
  }
}
