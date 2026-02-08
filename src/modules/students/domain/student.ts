import { t, Static } from "elysia";
import { BaseModelSchema } from "../../../core/models";
import { CreateUserDTO, UserSchema } from "../../users/domain/user";

export const CommonStudentFields = {
  userId: t.Number(),
  studentCode: t.String(),
  linkedin: t.Optional(t.Nullable(t.String())),
  github: t.Optional(t.Nullable(t.String())),
  facebook: t.Optional(t.Nullable(t.String())),
  instagram: t.Optional(t.Nullable(t.String())),
};

export const StudentSchema = t.Intersect([
  t.Object({
    id: t.Number(),
    ...CommonStudentFields,
    user: UserSchema,
  }),
  BaseModelSchema,
]);

export const CreateStudentModel = t.Object({
  ...CommonStudentFields,
  createdBy: t.Number(),
  updatedBy: t.Number(),
});

export const CreateStudentDTO = t.Intersect([
  CreateUserDTO,
  t.Object({
    ...CommonStudentFields,
    imageFile: t.Optional(t.Nullable(t.File())),
  }),
]);

export const StudentDTO = t.Object({
  id: t.Number(),
  ...CommonStudentFields,
  updatedAt: t.Date(),
  user: UserSchema,
});

export type Student = Static<typeof StudentSchema>;
export type CreateStudentDTO = Static<typeof CreateStudentDTO>;
export type StudentDTO = Static<typeof StudentDTO>;
export type CreateStudentModel = Static<typeof CreateStudentModel>;
