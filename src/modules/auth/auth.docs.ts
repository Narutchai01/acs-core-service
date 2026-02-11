import { t } from "elysia";
import {
  AuthRequestDTO,
  AuthResponseDTO,
  CreateCredentialsDTO,
} from "./domain/auth";
import { mapResponse } from "../../core/interceptor/response";

export const authDocs = {
  login: {
    detail: {
      description: "Authenticate a user and return an access token",
      summary: "User login",
      tags: ["Auth"],
    },
    body: AuthRequestDTO,
    response: mapResponse(AuthResponseDTO),
  },
  createCredentials: {
    detail: {
      description: "Create credentials for a user to reset their password",
      summary: "Create credentials for password reset",
      tags: ["Auth"],
    },
    body: CreateCredentialsDTO,
  },
  getCredentialsByReferenceCode: {
    detail: {
      description:
        "Get credentials using the reference code sent to the user's email",
      summary: "Get credentials by reference code",
      tags: ["Auth"],
    },
    params: t.Object({
      referenceCode: t.String({
        description: "The reference code sent to the user's email",
        examples: ["abc123def456"],
      }),
    }),
  },
  resetPassword: {
    detail: {
      description: "Reset the user's password using the reference code",
      summary: "Reset password",
      tags: ["Auth"],
    },
    params: t.Object({
      referenceCode: t.String({
        description: "The reference code sent to the user's email",
        examples: ["abc123def456"],
      }),
    }),
    body: t.Object({
      newPassword: t.String({
        description: "The new password for the user",
        examples: ["newSecurePassword123"],
      }),
    }),
  },
};
