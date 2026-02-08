import { t, Static } from "elysia";
import { BaseModelSchema } from "../../../core/models";

export const CommonStudentFields = {
  id: t.Number(),
  studentCode: t.String(),
  linkedin: t.Optional(t.Nullable(t.String())),
  github: t.Optional(t.Nullable(t.String())),
  facebook: t.Optional(t.Nullable(t.String())),
  instagram: t.Optional(t.Nullable(t.String())),
};

export const StudentSchema = t.Intersect([
  t.Object({
    ...CommonStudentFields,
  }),
  BaseModelSchema,
]);

export type Student = Static<typeof StudentSchema>;
