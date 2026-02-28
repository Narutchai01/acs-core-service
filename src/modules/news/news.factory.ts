import { News, NewsDTO, NewsFeatureDTO, NewsFeature } from "./domain/news";

export class NewsFactory {
  mapNewsToDTO(news: News): NewsDTO {
    return {
      id: news.id,
      title: news.title,
      image: news.image,
      detail: news.detail,
      startDate: news.startDate,
      dueDate: news.dueDate,
      tag: news.tag
        ? {
            id: news.tag.id,
            name: news.tag.name,
            tagsGroupsId: news.tag.tagsGroupsId,
          }
        : undefined,
    };
  }

  mapNewsListToDTO(newsList: News[]): NewsDTO[] {
    return newsList.map((news) => this.mapNewsToDTO(news));
  }

  mapNewsFeatureToDTO(newsFeature: NewsFeature): NewsFeatureDTO {
    return {
      ...newsFeature,
      news: this.mapNewsToDTO(newsFeature.news),
    };
  }

  mapNewsFeatureListToDTO(newsFeatureList: NewsFeature[]): NewsFeatureDTO[] {
    return newsFeatureList.map((newsFeature) =>
      this.mapNewsFeatureToDTO(newsFeature),
    );
  }
}
