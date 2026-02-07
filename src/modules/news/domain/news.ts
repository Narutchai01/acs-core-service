import { t, Static } from "elysia";
import { BaseModel } from "../../../core/models";

export const NewsSchema = t.Object({
  id: t.Number(),
  title: t.String(),
  image: t.String(),
  detail: t.String(),
  startDate: t.Date(),
  dueDate: t.Optional(t.Nullable(t.Date())),
  tagID: t.Number(),
});

export type News = Static<typeof NewsSchema & BaseModel>;

export const NewsDTO = t.Omit(NewsSchema, [
  "deteletedAt",
  "createdBy",
  "updatedBy",
  "createdAt",
  "deletedAt",
]);

export type CreateNewsDTO = Omit<
  News,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "deteletedAt"
  | "updatedBy"
  | "createdBy"
  | "image"
  // | "tags"
>;
