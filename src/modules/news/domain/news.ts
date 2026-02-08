import { t, Static } from "elysia";
import { BaseModelSchema } from "../../../core/models";

const CommonNewsFields = {
  title: t.String(),
  detail: t.String(),
  startDate: t.Date(),
  dueDate: t.Optional(t.Nullable(t.Date())),
  tagID: t.Numeric(), // ✨ แก้ปัญหา "Expected number" ให้อัตโนมัติ
};
export const CreateNewsDTO = t.Object({
  ...CommonNewsFields,
  image: t.File(),
});

export const NewsSchema = t.Intersect([
  t.Object({
    ...CommonNewsFields,
    image: t.String(),
  }),
  BaseModelSchema,
]);

export const NewsDTO = t.Object({
  ...CommonNewsFields,
  image: t.String(),

  id: t.Number(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type CreateNewsDTO = Static<typeof CreateNewsDTO>;
export type News = Static<typeof NewsSchema>;
export type NewsDTO = Static<typeof NewsDTO>;
