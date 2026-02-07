import { BaseModel } from "../../../core/models";
import { Static, t } from "elysia";

export const UserSchema = t.Object({
  id: t.Number(),
  firstNameTh: t.String(),
  lastNameTh: t.String(),
  // แก้ไขจุดนี้: เอา t.Nullable มาครอบ t.String()
  firstNameEn: t.Optional(t.Nullable(t.String())),
  lastNameEn: t.Optional(t.Nullable(t.String())),
  email: t.String(),
  nickName: t.Optional(t.Nullable(t.String())),
  imageUrl: t.Optional(t.Nullable(t.String())),
  password: t.Optional(t.Nullable(t.String())),
});

export type User = Static<typeof UserSchema> & BaseModel;

export type CreateUser = Omit<User, "id" | "createdAt" | "updatedAt">;
