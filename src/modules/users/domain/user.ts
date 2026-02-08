import { BaseModelSchema } from "../../../core/models";
import { Static, t } from "elysia";

export const CommonUserFields = {
  firstNameTh: t.String(),
  lastNameTh: t.String(),
  firstNameEn: t.Optional(t.Nullable(t.String())),
  lastNameEn: t.Optional(t.Nullable(t.String())),
  email: t.String(),
  nickName: t.Optional(t.Nullable(t.String())),
};

export const CreateUserDTO = t.Object({
  ...CommonUserFields,
});

export const UserSchema = t.Intersect([
  t.Object({
    id: t.Number(),
    ...CommonUserFields,
    password: t.Optional(t.Nullable(t.String())),
    imageUrl: t.Optional(t.Nullable(t.String())),
  }),
  BaseModelSchema,
]);

export type CreateUserDTO = Static<typeof CreateUserDTO>;
export type User = Static<typeof UserSchema>;
