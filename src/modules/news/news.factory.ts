import { News, NewsDTO, NewsFeatureDTO, NewsFeature } from "./domain/news";

export class NewsFactory {
  mapNewsToDTO(news: News): NewsDTO {
    return {
      ...news,
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
