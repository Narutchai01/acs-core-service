import { Static, t } from "elysia";

export const TypeCourseSchema = t.Object({
  id: t.Number(),
  type: t.String(),
  description: t.Optional(t.Nullable(t.String())),
});

export type TypeCourse = Static<typeof TypeCourseSchema>;
