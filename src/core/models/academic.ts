import { t, Static } from "elysia";

export const CommonAcademicPosition = {
  id: t.Number(),
  sequence: t.Number(),
  nameTh: t.String(),
  nameEn: t.String(),
  shortNameTh: t.String(),
  shortNameEn: t.String(),
};

export const AcademicPositionSchema = t.Object({
  ...CommonAcademicPosition,
});

export type AcademicPosition = Static<typeof AcademicPositionSchema>;
