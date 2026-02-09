import { t, Static } from "elysia";
import { BaseModelSchema } from "../../../core/models";
import { CommonUserFields, UserSchema } from "../../users/domain/user";

export const CommonProfessorFields = {
  phone: t.String(),
  profRoom: t.String(),
};

export const ProfessorSchema = t.Intersect([
  t.Object({
    id: t.Number(),
    userID: t.Number(),
    ...CommonProfessorFields,
    user: UserSchema,
  }),
  BaseModelSchema,
]);

export const CreateProfrssorDTO = t.Object({
  ...CommonProfessorFields,
  ...CommonUserFields,
  imageFile: t.Optional(t.File()),
  academicPositionID: t.Numeric(),
});

export const ProfessorDTO = t.Object({
  id: t.Number(),
  ...CommonProfessorFields,
  user: UserSchema,
});

export type Professor = Static<typeof ProfessorSchema>;
export type CreateProfessorDTO = Static<typeof CreateProfrssorDTO>;
export type ProfessorDTO = Static<typeof ProfessorDTO>;
