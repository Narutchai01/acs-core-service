import { t, Static } from "elysia";
import { BaseModelSchema } from "../../../core/models";

export const NewsContent = t.Object({
  title: t.String(),
  image: t.String(),
  detail: t.String(),
  startDate: t.Date(),
  dueDate: t.Optional(t.Nullable(t.Date())), // ใส่ Nullable เพื่อความชัวร์
  tagID: t.Number(),
});

export const NewsSchema = t.Intersect([NewsContent, BaseModelSchema]);

export const CreateNewsDTO = t.Omit(NewsSchema, [
  "id",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "createdBy",
  "updatedBy",
  "image",
]);

export const NewsDTO = t.Omit(NewsSchema, ["deletedAt", "createdBy", "tagID"]);

export type News = Static<typeof NewsSchema>;
export type NewsDTO = Static<typeof NewsDTO>;
export type CreateNewsDTO = Static<typeof CreateNewsDTO>;
