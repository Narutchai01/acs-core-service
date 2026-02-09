import { t, Static } from "elysia";
import { BaseModelSchema } from "../../../core/models";
export const CommonEducationFields = {
  education: t.String(),
};

export const EducationSchema = t.Intersect([
  t.Object({
    id: t.Number(),
    professorID: t.Number(),
    ...CommonEducationFields,
  }),
  BaseModelSchema,
]);

export const EducationDTO = t.Object({
  id: t.Number(),
  ...CommonEducationFields,
});

export type Education = Static<typeof EducationSchema>;
export type EducationDTO = Static<typeof EducationDTO>;
