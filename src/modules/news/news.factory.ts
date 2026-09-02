import {
  News,
  NewsDTO,
  NewsFeatureDTO,
  NewsFeature,
  NewsAdditionalImage,
  NewsWithAdditionalImage,
  NewsWithAdditionalImageDTO,
} from "./domain/news";

export class NewsFactory {
  mapNewsToDTO(news: News): NewsDTO {
    return {
      id: news.id,
      title: news.title,
      thumbnailURL: news.thumbnail,
      highlightURL: news.highlight,
      detail: news.detail,
      startDate: news.startDate,
      dueDate: news.dueDate,
      cardFocalPointX: news.cardFocalPointX,
      cardFocalPointY: news.cardFocalPointY,
      thumbnailFocalPointX: news.thumbnailFocalPointX,
      thumbnailFocalPointY: news.thumbnailFocalPointY,
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

  mapNewsWithAdditionalImage(news: News) {
    return {
      ...news,
    };
  }

  mapNewsWithAdditionalImageToDTO(
    news: NewsWithAdditionalImage,
  ): NewsWithAdditionalImageDTO {
    return {
      ...this.mapNewsToDTO(news),
      newsAdditionalImages: news.newsAdditionalImages,
    };
  }

  mapNewsWithAdditionalImageToDTO(
    news: NewsWithAdditionalImage,
  ): NewsWithAdditionalImageDTO {
    return {
      ...this.mapNewsToDTO(news),
      newsAdditionalImages: news.newsAdditionalImages,
    };
  }
}
