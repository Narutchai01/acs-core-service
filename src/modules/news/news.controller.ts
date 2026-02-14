import Elysia from "elysia";
import { NewsRepository } from "../../infrastructure/news.repository";
import { prisma } from "../../lib/db";
import { NewsService } from "./news.service";
import { NewsDocs } from "./news.docs";
import { success } from "../../core/interceptor/response";
import { NewsFactory } from "./news.factory";
import { SupabaseService } from "../../core/utils/supabase";
import { HttpStatusCode } from "../../core/types/http";

const newsRepository = new NewsRepository(prisma);
const newsFactory = new NewsFactory();
const supabaseService = new SupabaseService();
const newsService = new NewsService(
  newsRepository,
  newsFactory,
  supabaseService,
);

export const newsController = (app: Elysia) =>
  app.decorate("newsService", newsService).group("/news", (app) =>
    app
      .post(
        "/",
        async ({ newsService, body, set }) => {
          const news = await newsService.createNews(body);
          set.status = HttpStatusCode.CREATED;
          return success(
            news,
            "News created successfully",
            HttpStatusCode.CREATED,
          );
        },
        NewsDocs.createNews,
      )
      .get(
        "/",
        async ({ newsService, query, set }) => {
          const newsList = await newsService.getNews(query);
          set.status = HttpStatusCode.OK;
          return success(newsList, "News retrieved successfully");
        },
        NewsDocs.getNews,
      )
      .get(
        "/:id",
        async ({ newsService, params, set }) => {
          const news = await newsService.getNewsById(Number(params.id));
          if (!news) {
            set.status = HttpStatusCode.NOT_FOUND;
            return success(null, "News not found", HttpStatusCode.NOT_FOUND);
          }
          return success(news, "News retrieved successfully");
        },
        NewsDocs.getNewsById,
      )
      .group("/news-features", (app) =>
        app.put(
          "/",
          async ({ newsService, body, set }) => {
            const newsFeature = await newsService.upsertNewsFeature(body);
            set.status = HttpStatusCode.OK;
            console.log(newsFeature);
            return success(newsFeature, "News feature upserted successfully");
          },
          NewsDocs.upsertNewsFeature,
        ),
      ),
  );
