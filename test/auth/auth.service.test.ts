import { describe, expect, test } from "bun:test";
import {
  CreateCredentialsDTO,
  ResetPasswordDTO,
} from "../../src/modules/auth/domain/auth";
import { AuthService } from "../../src/modules/auth/auth.service";

describe("AuthService", () => {
  test("requests a Better Auth reset link for the configured frontend page", async () => {
    const request = new Headers({ origin: "https://app.example.com" });
    const input: CreateCredentialsDTO = { email: "user@example.com" };
    let passwordResetRequest:
      | {
          email: string;
          redirectTo: string;
          headers: Headers;
        }
      | undefined;
    const service = new AuthService(
      {
        requestPasswordReset: async (data) => {
          passwordResetRequest = data;
        },
        resetPassword: async () => {
          throw new Error("Not used by this test");
        },
      },
      "https://app.example.com/reset-password",
    );

    await service.createCredentials(input, request);

    expect(passwordResetRequest).toEqual({
      email: input.email,
      redirectTo: "https://app.example.com/reset-password",
      headers: request,
    });
  });

  test("delegates reset tokens and new passwords to Better Auth", async () => {
    const request = new Headers({ origin: "https://app.example.com" });
    const input: ResetPasswordDTO = { newPassword: "N3wP@ssword" };
    let resetPasswordRequest:
      | {
          token: string;
          newPassword: string;
          headers: Headers;
        }
      | undefined;
    const service = new AuthService(
      {
        requestPasswordReset: async () => {
          throw new Error("Not used by this test");
        },
        resetPassword: async (data) => {
          resetPasswordRequest = data;
        },
      },
      "https://app.example.com/reset-password",
    );

    await service.resetPassword("reset-token", input, request);

    expect(resetPasswordRequest).toEqual({
      token: "reset-token",
      newPassword: input.newPassword,
      headers: request,
    });
  });
});
