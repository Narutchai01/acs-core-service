import { BaseModelSchema } from "../../../core/models";
import { Static, t } from "elysia";

export const CommonUserFields = {
  firstNameTh: t.String({
    minLength: 1,
  }),
  lastNameTh: t.String({
    minLength: 1,
  }),
  firstNameEn: t.Optional(t.Nullable(t.String())),
  lastNameEn: t.Optional(t.Nullable(t.String())),
  email: t.String({
    minLength: 5,
    format: "email",
    examples: ["acs.com@kmutt.ac.th"],
  }),
  nickName: t.Optional(
    t.Nullable(
      t.String({
        minLength: 1,
        examples: ["Ace"],
      }),
    ),
  ),
};

export const CreateUserDTO = t.Object({
  ...CommonUserFields,
});

export const CreateSuperUserDTO = t.Object({
  ...CommonUserFields,
  password: t.String({
    minLength: 4,
    examples: ["P@ssw0rd"],
  }),
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
export type CreateSuperUserDTO = Static<typeof CreateSuperUserDTO>;

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
