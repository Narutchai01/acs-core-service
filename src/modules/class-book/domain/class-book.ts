import { t, Static } from "elysia";
import { BaseModelSchema, CommonQueryParams } from "../../../core/models";
import {
  CurriculumSchema,
  CurriculumDTO,
} from "../../curriculums/domain/curriculum";

export const CommonClassBookFields = {
  classof: t.String(),
  firstYearAcademic: t.String(),
};

export const ClassBookSchema = t.Intersect([
  t.Object({
    id: t.Number(),
    ...CommonClassBookFields,
    thumbnailURL: t.String(),
    curriculumID: t.Number(),
    curriculum: CurriculumSchema,
  }),
  BaseModelSchema,
]);

export const CreateClassBookDTO = t.Object({
  ...CommonClassBookFields,
  thumbnailFile: t.File(),
  curriculumID: t.Numeric(),
});

export const ClassBookQueryParams = t.Object({
  ...CommonQueryParams,
  search: t.Optional(t.String()),
  searchBy: t.Optional(t.String()),
  curriculumID: t.Optional(t.Number()),
});

export const ClassBookDTO = t.Object({
  id: t.Number(),
  ...CommonClassBookFields,
  thumbnailURL: t.String(),
  curriculumID: t.Number(),
  curriculum: CurriculumDTO,
});

export const UpdateClassBookDTO = t.Partial(
  t.Object({
    ...CommonClassBookFields,
    thumbnailFile: t.File(),
    curriculumID: t.Numeric(),
  }),
);

export type ClassBook = Static<typeof ClassBookSchema>;
export type ClassBookDTO = Static<typeof ClassBookDTO>;
export type CreateClassBookDTO = Static<typeof CreateClassBookDTO>;
export type ClassBookQueryParams = Static<typeof ClassBookQueryParams>;
export type UpdateClassBookDTO = Static<typeof UpdateClassBookDTO>;
