import { t, Static } from "elysia";
import { BaseModelSchema, CommonQueryParams } from "../../../core/models";

export const CommonCurriculumField = {
  year: t.String(),
  documentURL: t.String(),
  description: t.String(),
};

export const CurriculumSchema = t.Intersect([
  t.Object({
    id: t.Number(),
    thumbnailURL: t.String(),
    ...CommonCurriculumField,
  }),
  BaseModelSchema,
]);

export const CreateCurriculumDTO = t.Object({
  thumbnailFile: t.File(),
  ...CommonCurriculumField,
});

export const CurriculumDTO = t.Object({
  id: t.Number(),
  thumbnailURL: t.String(),
  ...CommonCurriculumField,
});

export const CurriculumQueryParams = t.Object({
  ...CommonQueryParams,
  year: t.Optional(t.String()),
});

export type Curriculum = Static<typeof CurriculumSchema>;
export type CreateCurriculumDTO = Static<typeof CreateCurriculumDTO>;
export type CurriculumDTO = Static<typeof CurriculumDTO>;
export type CurriculumQueryParams = Static<typeof CurriculumQueryParams>;
