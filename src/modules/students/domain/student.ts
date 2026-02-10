import { t, Static } from "elysia";
import { BaseModelSchema, CommonQueryParams } from "../../../core/models";
import { UserSchema, CommonUserFields } from "../../users/domain/user";

export const CommonStudentFields = {
  studentCode: t.String(),
  linkedin: t.Optional(t.Nullable(t.String())),
  github: t.Optional(t.Nullable(t.String())),
  facebook: t.Optional(t.Nullable(t.String())),
  instagram: t.Optional(t.Nullable(t.String())),
};

export const StudentSchema = t.Intersect([
  t.Object({
    id: t.Number(),
    userID: t.Number(),
    ...CommonStudentFields,
    user: UserSchema,
  }),
  BaseModelSchema,
]);

export const CreateStudentModel = t.Object({
  ...CommonStudentFields,
  classBookID: t.Number(),
  createdBy: t.Number(),
  updatedBy: t.Number(),
});

export const CreateStudentDTO = t.Object({
  ...CommonStudentFields,
  ...CommonUserFields,
  classBookID: t.Numeric(),
  imageFile: t.Optional(t.Nullable(t.File())),
});

export const StudentDTO = t.Object({
  id: t.Number(),
  ...CommonStudentFields,
  user: UserSchema,
});

export const StudentQueryParams = t.Object({
  ...CommonQueryParams,
});

export const StudentUpdateDTO = t.Partial(
  t.Object({
    ...CommonStudentFields,
    ...CommonUserFields,
    classBookID: t.Numeric(),
    imageFile: t.Optional(t.Nullable(t.File())),
  }),
);

export type Student = Static<typeof StudentSchema>;
export type CreateStudentDTO = Static<typeof CreateStudentDTO>;
export type StudentDTO = Static<typeof StudentDTO>;
export type CreateStudentModel = Static<typeof CreateStudentModel>;
export type StudentQueryParams = Static<typeof StudentQueryParams>;
export type StudentUpdateDTO = Static<typeof StudentUpdateDTO>;
