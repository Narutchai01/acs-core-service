import { describe, expect, test } from "bun:test";
import type { SupabaseService } from "../../../src/core/utils/supabase";
import type {
  CreateNewsDTO,
  News,
  NewsCreatePayload,
  NewsFeature,
} from "../../../src/modules/news/domain/news";
import type { INewsRepository } from "../../../src/modules/news/domain/news.repository";
import { NewsFactory } from "../../../src/modules/news/news.factory";
import { NewsService } from "../../../src/modules/news/news.service";

const startDate = new Date("2026-08-02T00:00:00.000Z");

const newsFixture = (focalPoints?: {
  cardFocalPointX?: number;
  cardFocalPointY?: number;
  thumbnailFocalPointX?: number;
  thumbnailFocalPointY?: number;
}): News => ({
  id: 1,
  title: "News title",
  detail: "News detail",
  startDate,
  dueDate: null,
  image: "https://example.com/thumbnail.jpg",
  thumbnail: "https://example.com/thumbnail.jpg",
  highlight: "https://example.com/highlight.jpg",
  cardFocalPointX: focalPoints?.cardFocalPointX ?? null,
  cardFocalPointY: focalPoints?.cardFocalPointY ?? null,
  thumbnailFocalPointX: focalPoints?.thumbnailFocalPointX ?? null,
  thumbnailFocalPointY: focalPoints?.thumbnailFocalPointY ?? null,
  tagID: 1,
  tag: { id: 1, name: "Announcement", tagsGroupsId: 1 },
  createdAt: startDate,
  updatedAt: startDate,
  createdBy: 0,
  updatedBy: 0,
  deletedAt: null,
});

class FakeNewsRepository implements INewsRepository {
  createdPayload?: NewsCreatePayload;
  news = newsFixture();

  async createNews(data: NewsCreatePayload): Promise<News> {
    this.createdPayload = data;
    return this.news;
  }

  async getNews(): Promise<News[]> {
    return [this.news];
  }

  async getNewsById(): Promise<News | null> {
    return this.news;
  }

  async upsertNewsFeature(): Promise<NewsFeature> {
    throw new Error("Not implemented");
  }

  async getNewsFeaturesBy(): Promise<NewsFeature[]> {
    return [];
  }

  async countNews(): Promise<number> {
    return 1;
  }

  async countNewsFeatures(): Promise<number> {
    return 0;
  }

  async getNewsFeatureById(): Promise<NewsFeature | null> {
    return null;
  }

  async deleteNews(): Promise<News | null> {
    return null;
  }

  async updateNews(): Promise<News | null> {
    return null;
  }
}

const createNewsInput = (focalPoints?: {
  cardFocalPointX?: number;
  cardFocalPointY?: number;
  thumbnailFocalPointX?: number;
  thumbnailFocalPointY?: number;
}): CreateNewsDTO => ({
  title: "News title",
  detail: "News detail",
  startDate,
  thumbnail: new File(["thumbnail"], "thumbnail.jpg", {
    type: "image/jpeg",
  }),
  highlight: new File(["highlight"], "highlight.jpg", {
    type: "image/jpeg",
  }),
  tagID: 1,
  ...focalPoints,
});

const createService = (repository: FakeNewsRepository) => {
  const storage = {
    uploadFile: async (file: File, folder: string) =>
      `https://example.com/${folder}/${file.name}`,
    deleteFile: async () => undefined,
  } as unknown as SupabaseService;

  return new NewsService(repository, new NewsFactory(), storage);
};

describe("NewsService", () => {
  test("creates news with focal points", async () => {
    const repository = new FakeNewsRepository();
    repository.news = newsFixture({
      cardFocalPointX: 25.5,
      cardFocalPointY: 75.25,
      thumbnailFocalPointX: 40,
      thumbnailFocalPointY: 60,
    });
    const service = createService(repository);

    const result = await service.createNews(
      createNewsInput({
        cardFocalPointX: 25.5,
        cardFocalPointY: 75.25,
        thumbnailFocalPointX: 40,
        thumbnailFocalPointY: 60,
      }),
    );

    expect(repository.createdPayload).toMatchObject({
      cardFocalPointX: 25.5,
      cardFocalPointY: 75.25,
      thumbnailFocalPointX: 40,
      thumbnailFocalPointY: 60,
    });
    expect(result).toMatchObject({
      cardFocalPointX: 25.5,
      cardFocalPointY: 75.25,
      thumbnailFocalPointX: 40,
      thumbnailFocalPointY: 60,
    });
  });

  test("creates news without focal points", async () => {
    const repository = new FakeNewsRepository();
    const service = createService(repository);

    const result = await service.createNews(createNewsInput());

    expect(repository.createdPayload).not.toHaveProperty("cardFocalPointX");
    expect(repository.createdPayload).not.toHaveProperty("cardFocalPointY");
    expect(repository.createdPayload).not.toHaveProperty(
      "thumbnailFocalPointX",
    );
    expect(repository.createdPayload).not.toHaveProperty(
      "thumbnailFocalPointY",
    );
    expect(result).toMatchObject({
      cardFocalPointX: null,
      cardFocalPointY: null,
      thumbnailFocalPointX: null,
      thumbnailFocalPointY: null,
    });
  });

  test("returns focal points from getNews", async () => {
    const repository = new FakeNewsRepository();
    repository.news = newsFixture({ cardFocalPointX: 20, cardFocalPointY: 80 });
    const service = createService(repository);

    const result = await service.getNews({});

    expect(result).toMatchObject({
      rows: [
        {
          id: 1,
          cardFocalPointX: 20,
          cardFocalPointY: 80,
          thumbnailFocalPointX: null,
          thumbnailFocalPointY: null,
        },
      ],
      totalRecords: 1,
    });
  });

  test("returns news without focal points from getNewsById", async () => {
    const repository = new FakeNewsRepository();
    const service = createService(repository);

    const result = await service.getNewsById(1);

    expect(result).toMatchObject({
      id: 1,
      cardFocalPointX: null,
      cardFocalPointY: null,
      thumbnailFocalPointX: null,
      thumbnailFocalPointY: null,
    });
  });
});
