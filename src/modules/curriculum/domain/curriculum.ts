import { t, Static } from "elysia";
import { BaseModelSchema } from "../../../core/models";

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
  thumbnail: t.File(),
  ...CommonCurriculumField,
});

export type Curriculum = Static<typeof CurriculumSchema>;
export type CreateCurriculumDTO = Static<typeof CreateCurriculumDTO>;
