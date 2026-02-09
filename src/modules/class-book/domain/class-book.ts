import { t, Static } from "elysia";
import { BaseModelSchema } from "../../../core/models";

export const CommonClassBookFields = {
  classof: t.String(),
  firstYearAcademic: t.String(),
};

export const ClassBookSchema = t.Intersect([
  t.Object({
    id: t.Number(),
    ...CommonClassBookFields,
    thumbnailURL: t.String(),
  }),
  BaseModelSchema,
]);

export const CreateClassBookDTO = t.Object({
  ...CommonClassBookFields,
  thumbnailFile: t.File(),
  curriculumID: t.Numeric(),
});

export const ClassBookQueryParams = t.Object({
  classof: t.Optional(t.String()),
  firstYearAcademic: t.Optional(t.String()),
});

export const ClassBookDTO = t.Object({
  id: t.Number(),
  ...CommonClassBookFields,
  thumbnailURL: t.String(),
});

export type ClassBook = Static<typeof ClassBookSchema>;
export type ClassBookDTO = Static<typeof ClassBookDTO>;
export type CreateClassBookDTO = Static<typeof CreateClassBookDTO>;
