import { Static, t } from "elysia";
import { BaseModelSchema } from "../../../core/models";

export const CommonAuthFields = {
  email: t.String({ format: "email" }),
  password: t.String(),
};

export const CommonForgetPasswordCedentialsFields = {
  refferenceCode: t.String(),
  expiredAt: t.Date(),
};

export const AuthRequestDTO = t.Object({
  ...CommonAuthFields,
});

export const ForgetPasswordSchema = t.Intersect([
  t.Object({
    ...CommonForgetPasswordCedentialsFields,
    userID: t.Number(),
  }),
  BaseModelSchema,
]);

export const CreateCredentialsDTO = t.Object({
  email: t.String({ format: "email" }),
});

export const CredentialsDTO = t.Object({
  ...CommonForgetPasswordCedentialsFields,
});

export const ResetPasswordDTO = t.Object({
  newPassword: t.String(),
});

export const AuthResponseDTO = t.Intersect([
  t.Object({
    accessToken: t.String(),
    refreshToken: t.String(),
  }),
]);

export const AuthPayload = t.Object({
  userID: t.Number(),
  roles: t.ArrayString(t.String()),
});

export type AuthRequestDTO = Static<typeof AuthRequestDTO>;
export type ForgetPasswordSchema = Static<typeof ForgetPasswordSchema>;
export type CreateCredentialsDTO = Static<typeof CreateCredentialsDTO>;
export type CredentialsDTO = Static<typeof CredentialsDTO>;
export type AuthResponseDTO = Static<typeof AuthResponseDTO>;
export type AuthPayload = Static<typeof AuthPayload>;
