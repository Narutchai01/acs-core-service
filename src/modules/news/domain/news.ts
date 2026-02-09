import { t, Static } from "elysia";
import { BaseModelSchema, CommonQueryParams } from "../../../core/models";

const CommonNewsFields = {
  title: t.String(),
  detail: t.String(),
  startDate: t.Date(),
  dueDate: t.Optional(t.Nullable(t.Date())),
};
export const CreateNewsDTO = t.Object({
  ...CommonNewsFields,
  image: t.File(),
  tagID: t.Numeric(), // ✨ แก้ปัญหา "Expected number" ให้อัตโนมัติ
});

export const NewsSchema = t.Intersect([
  t.Object({
    id: t.Number(),
    ...CommonNewsFields,
    image: t.String(),
  }),
  BaseModelSchema,
]);

export const NewsDTO = t.Object({
  id: t.Number(),
  ...CommonNewsFields,
});

export const NewsQueryParams = t.Object({
  tagID: t.Optional(t.Numeric()),
  ...CommonQueryParams,
});

export type CreateNewsDTO = Static<typeof CreateNewsDTO>;
export type News = Static<typeof NewsSchema>;
export type NewsDTO = Static<typeof NewsDTO>;
export type NewsQueryParams = Static<typeof NewsQueryParams>;
