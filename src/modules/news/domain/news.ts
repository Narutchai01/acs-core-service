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

export const CommonNewsFeatureFields = {
  newsID: t.Numeric(),
  tagID: t.Numeric(),
};

export const UpsertNewsFeatureDTO = t.Object({
  id: t.Optional(t.Numeric()),
  ...CommonNewsFeatureFields,
  thumbnail: t.File({
    errorMessage: "Invalid file type. Only image files are allowed.",
  }),
});

export const NewsFeatureSchema = t.Intersect([
  t.Object({
    id: t.Number(),
    ...CommonNewsFeatureFields,
    thumbnailURL: t.String(),
    news: NewsSchema,
  }),
  BaseModelSchema,
]);

export const NewsFeatureDTO = t.Object({
  id: t.Number(),
  // ...CommonNewsFeatureFields,
  thumbnailURL: t.String(),
  news: NewsDTO,
});

export type CreateNewsDTO = Static<typeof CreateNewsDTO>;
export type News = Static<typeof NewsSchema>;
export type NewsDTO = Static<typeof NewsDTO>;
export type NewsQueryParams = Static<typeof NewsQueryParams>;
export type UpsertNewsFeatureDTO = Static<typeof UpsertNewsFeatureDTO>;
export type NewsFeature = Static<typeof NewsFeatureSchema>;
export type NewsFeatureDTO = Static<typeof NewsFeatureDTO>;
