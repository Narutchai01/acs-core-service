import Elysia from "elysia";
import { NewsRepository } from "../../infrastructure/news.repository";
import { prisma } from "../../lib/db";
import { NewsService } from "./news.service";
import { NewsDocs } from "./news.docs";
import { success } from "../../core/interceptor/response";
import { NewsFactory } from "./news.factory";

const newsRepository = new NewsRepository(prisma);
const newsFactory = new NewsFactory();
const newsService = new NewsService(newsRepository, newsFactory);

export const newsController = new Elysia({ prefix: "/news" }).decorate(
  "newsService",
  newsService,
);

newsController
  .post(
    "/",
    async ({ newsService, body, set }) => {
      const news = await newsService.createNews(body);
      set.status = 201;
      return success(news, "News created successfully", 201);
    },
    NewsDocs.createNews,
  )
  .get(
    "/",
    async ({ newsService }) => {
      const newsList = await newsService.getNews();
      return success(newsList, "News retrieved successfully");
    },
    NewsDocs.getNews,
  );
