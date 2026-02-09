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

export const CreateUserModel = t.Object({
  ...CommonUserFields,
  password: t.Optional(t.Nullable(t.String())),
  imageUrl: t.Optional(t.Nullable(t.String())),
  createdBy: t.Number(),
  updatedBy: t.Number(),
});

export const UserDTO = t.Object({
  id: t.Number(),
  ...CommonUserFields,
  imageUrl: t.Optional(t.Nullable(t.String())),
});

export type CreateUserDTO = Static<typeof CreateUserDTO>;
export type User = Static<typeof UserSchema>;
export type CreateUserModel = Static<typeof CreateUserModel>;
export type UserDTO = Static<typeof UserDTO>;

export const CommonUserRoleFields = {
  id: t.Number(),
  userID: t.Number(),
  roleID: t.Number(),
};

export const UserRoleSchema = t.Intersect([
  t.Object({
    ...CommonUserRoleFields,
  }),
  BaseModelSchema,
]);

export type UserRole = Static<typeof UserRoleSchema>;
