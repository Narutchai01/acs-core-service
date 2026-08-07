import { t, Static } from "elysia";
import { BaseModelSchema, CommonQueryParams } from "../../../core/models";
import { Tag } from "../../../core/models/tag";

const CommonNewsFields = {
  title: t.String(),
  detail: t.String(),
  startDate: t.Date(),
  dueDate: t.Optional(t.Nullable(t.Date())),
};

const FocalPointInputFields = {
  cardFocalPointX: t.Optional(t.Numeric()),
  cardFocalPointY: t.Optional(t.Numeric()),
  thumbnailFocalPointX: t.Optional(t.Numeric()),
  thumbnailFocalPointY: t.Optional(t.Numeric()),
};

const FocalPointResponseFields = {
  cardFocalPointX: t.Optional(t.Nullable(t.Number())),
  cardFocalPointY: t.Optional(t.Nullable(t.Number())),
  thumbnailFocalPointX: t.Optional(t.Nullable(t.Number())),
  thumbnailFocalPointY: t.Optional(t.Nullable(t.Number())),
};

export const CreateNewsDTO = t.Object({
  ...CommonNewsFields,
  ...FocalPointInputFields,
  thumbnail: t.File(),
  highlight: t.File(),
  tagID: t.Numeric(), // ✨ แก้ปัญหา "Expected number" ให้อัตโนมัติ
});

export const NewsSchema = t.Intersect([
  t.Object({
    id: t.Number(),
    ...CommonNewsFields,
    image: t.String(),
    thumbnail: t.Nullable(t.String()),
    highlight: t.Nullable(t.String()),
    ...FocalPointResponseFields,
    tagID: t.Numeric(),
    tag: t.Optional(Tag),
  }),
  BaseModelSchema,
]);

export const NewsDTO = t.Object({
  id: t.Number(),
  thumbnailURL: t.Nullable(t.String()),
  highlightURL: t.Nullable(t.String()),
  ...CommonNewsFields,
  ...FocalPointResponseFields,
  tag: t.Optional(Tag),
});

export const NewsUpdateDTO = t.Partial(
  t.Object({
    ...CommonNewsFields,
    ...FocalPointInputFields,
    thumbnail: t.File(),
    highlight: t.File(),
    tagID: t.Numeric(),
  }),
);

export const NewsQueryParams = t.Object({
  tagID: t.Optional(t.Numeric()),
  ...CommonQueryParams,
  search: t.Optional(t.String()),
  searchBy: t.Optional(t.String()),
});

export const CommonNewsFeatureFields = {
  newsID: t.Numeric(),
  tagID: t.Numeric(),
};

export const UpsertNewsFeatureDTO = t.Object({
  id: t.Optional(t.Numeric()),
  ...CommonNewsFeatureFields,
  thumbnail: t.Union([
    t.String(),
    t.File({
      errorMessage: "Invalid file type. Only image files are allowed.",
    }),
  ]),
  highlight: t.Optional(
    t.Union([
      t.String(),
      t.File({
        errorMessage: "Invalid file type. Only image files are allowed.",
      }),
    ]),
  ),
});

export const NewsFeatureSchema = t.Intersect([
  t.Object({
    id: t.Number(),
    ...CommonNewsFeatureFields,
    thumbnailURL: t.String(),
    highlightURL: t.Optional(t.Nullable(t.String())),
    news: NewsSchema,
  }),
  BaseModelSchema,
]);

export const NewsFeatureDTO = t.Object({
  id: t.Number(),
  // ...CommonNewsFeatureFields,
  thumbnailURL: t.String(),
  highlightURL: t.Optional(t.Nullable(t.String())),
  news: NewsDTO,
});

export const QueryNewsFeatureParams = t.Object({
  tagID: t.Optional(t.Numeric()),
  ...CommonQueryParams,
});

export const NewsCreatePayloadSchema = t.Object({
  ...CommonNewsFields,
  ...FocalPointInputFields,
  image: t.String(),
  thumbnail: t.String(),
  highlight: t.String(),
  tagID: t.Numeric(),
  createdBy: t.Number(),
  updatedBy: t.Number(),
});

export const NewsUpdatePayloadSchema = t.Partial(
  t.Object({
    ...CommonNewsFields,
    ...FocalPointInputFields,
    thumbnail: t.String(),
    highlight: t.String(),
    tagID: t.Numeric(),
    updatedBy: t.Number(),
    updatedAt: t.Date(),
  })
);

export const NewsFeaturUpsertPayloadSchema = t.Object({
  ...CommonNewsFeatureFields,
  thumbnailURL: t.String(),
  highlightURL: t.Optional(t.String()),
  createdBy: t.Number(),
  updatedBy: t.Number(),
});

export type CreateNewsDTO = Static<typeof CreateNewsDTO>;
export type News = Static<typeof NewsSchema>;
export type NewsDTO = Static<typeof NewsDTO>;
export type NewsUpdateDTO = Static<typeof NewsUpdateDTO>;
export type NewsQueryParams = Static<typeof NewsQueryParams>;
export type UpsertNewsFeatureDTO = Static<typeof UpsertNewsFeatureDTO>;
export type NewsFeature = Static<typeof NewsFeatureSchema>;
export type NewsFeatureDTO = Static<typeof NewsFeatureDTO>;
export type QueryNewsFeatureParams = Static<typeof QueryNewsFeatureParams>;
export type NewsCreatePayload = Static<typeof NewsCreatePayloadSchema>;
export type NewsUpdatePayload = Static<typeof NewsUpdatePayloadSchema>;
export type NewsFeatureUpsertPayload = Static<typeof NewsFeaturUpsertPayloadSchema>;
