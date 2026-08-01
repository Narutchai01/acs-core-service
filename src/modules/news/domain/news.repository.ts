import {
  News,
  NewsQueryParams,
  NewsFeature,
  QueryNewsFeatureParams,
  NewsCreatePayload,
  NewsFeatureCreatePayload,
  NewsUpdatePayload,
} from "./news";


export interface INewsRepository {
  createNews(data: NewsCreatePayload): Promise<News>;
  getNews(query: NewsQueryParams): Promise<News[]>;
  getNewsById(id: number): Promise<News | null>;
  upsertNewsFeature(
    newsFeatureData: NewsFeatureCreatePayload,
  ): Promise<NewsFeature>;
  getNewsFeaturesBy(query: QueryNewsFeatureParams): Promise<NewsFeature[]>;
  getNewsFeatureById(id: number): Promise<NewsFeature | null>;
  countNews(query: NewsQueryParams): Promise<number>;
  countNewsFeatures(query: QueryNewsFeatureParams): Promise<number>;
  deleteNews(id: number): Promise<News | null>;
  updateNews(
    id: number,
    data: NewsUpdatePayload,
  ): Promise<News | null>;
}
