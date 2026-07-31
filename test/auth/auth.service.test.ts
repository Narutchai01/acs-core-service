import { describe, expect, test } from "bun:test";
import { verifyPassword } from "better-auth/crypto";
import { User } from "../../src/modules/users/domain/user";
import { IUserRepository } from "../../src/modules/users/domain/user.repository";
import { AuthFactory } from "../../src/modules/auth/auth.factory";
import { ForgetPasswordSchema } from "../../src/modules/auth/domain/auth";
import { AuthService } from "../../src/modules/auth/auth.service";

describe("AuthService.resetPassword", () => {
  test("updates the Better Auth credential password hash", async () => {
    const credentials = createCredentials();
    const newPassword = "N3wP@ssword";
    let syncedCredential: { userID: number; passwordHash: string } | undefined;

    const service = new AuthService(
      createUserRepository(),
      {
        createCredentialsForgetPassword: async () => credentials,
        getCredentialsByReferenceCode: async () => credentials,
        syncCredentialAccount: async (userID, passwordHash) => {
          syncedCredential = { userID, passwordHash };
        },
      },
      new AuthFactory(),
    );

    await service.resetPassword(credentials.refferenceCode, newPassword);

    expect(syncedCredential?.userID).toBe(credentials.userID);
    expect(
      await verifyPassword({
        password: newPassword,
        hash: syncedCredential?.passwordHash ?? "",
      }),
    ).toBe(true);
  });
});

const createUserRepository = (): IUserRepository => ({
  createUser: async () => {
    throw new Error("Not used by this test");
  },
  getUsers: async () => [],
  assignUserRole: async () => {
    throw new Error("Not used by this test");
  },
  updateUser: async () => {
    throw new Error("Not used by this test");
  },
  getUserByEmail: async (): Promise<User | null> => null,
  getUserById: async (): Promise<User | null> => null,
});

const createCredentials = (): ForgetPasswordSchema => {
  const now = new Date("2026-08-01T00:00:00.000Z");

  return {
    userID: 42,
    refferenceCode: "reset-reference",
    expiredAt: new Date("2026-08-02T00:00:00.000Z"),
    createdAt: now,
    updatedAt: now,
    createdBy: 0,
    updatedBy: 0,
    deletedAt: null,
  };
};
