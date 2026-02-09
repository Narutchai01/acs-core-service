import { t, Static } from "elysia";

export const CommonAcademicPosition = {
  id: t.Number(),
  sequence: t.Number(),
  nameTh: t.String(),
  shortTh: t.String(),
  nameEn: t.String(),
  shortEn: t.String(),
};

export const AcademicPositionSchema = t.Object({
  ...CommonAcademicPosition,
});

export type AcademicPosition = Static<typeof AcademicPositionSchema>;
