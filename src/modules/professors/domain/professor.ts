import { t, Static } from "elysia";
import { BaseModelSchema, CommonQueryParams } from "../../../core/models";
import { CommonUserFields, UserSchema } from "../../users/domain/user";

export const CommonProfessorFields = {
  phone: t.String(),
  profRoom: t.String(),
};

export const ProfessorSchema = t.Intersect([
  t.Object({
    id: t.Number(),
    userID: t.Number(),
    expertFields: t.String(),
    educations: t.String(),
    ...CommonProfessorFields,
    user: UserSchema,
  }),
  BaseModelSchema,
]);

export const CreateProfrssorDTO = t.Object({
  ...CommonProfessorFields,
  ...CommonUserFields,
  imageFile: t.Optional(t.File()),
  expertFields: t.String(),
  educations: t.String(),
  academicPositionID: t.Numeric(),
});

export const ProfessorDTO = t.Object({
  id: t.Number(),
  ...CommonProfessorFields,
  expertFields: t.Array(t.String()),
  educations: t.Array(t.String()),
  user: UserSchema,
});

export const ProfessorQueryParams = t.Object({
  ...CommonQueryParams,
});

export type Professor = Static<typeof ProfessorSchema>;
export type CreateProfessorDTO = Static<typeof CreateProfrssorDTO>;
export type ProfessorDTO = Static<typeof ProfessorDTO>;
export type ProfessorQueryParams = Static<typeof ProfessorQueryParams>;
