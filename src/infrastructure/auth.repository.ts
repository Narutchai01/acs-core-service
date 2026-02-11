import { PrismaClient } from "../generated/prisma/client";
import { IAuthRepository } from "../modules/auth/domain/auth.repository";
import { ForgetPasswordSchema } from "../modules/auth/domain/auth";
import { AppError } from "../core/error/app-error";
import { ErrorCode } from "../core/types/errors";

export class AuthRepository implements IAuthRepository {
  constructor(private readonly db: PrismaClient) {}

  async createCredentialsForgetPassword(
    userID: number,
  ): Promise<ForgetPasswordSchema> {
    const credentials = await this.db.forgetPasswordCredential.create({
      data: {
        userID: userID,
        createdBy: userID,
        updatedBy: userID,
      },
    });

    return credentials;
  }

  async getCredentialsByReferenceCode(
    referenceCode: string,
  ): Promise<ForgetPasswordSchema | null> {
    try {
      const credentials = await this.db.forgetPasswordCredential.findFirst({
        where: {
          refferenceCode: referenceCode,
        },
      });

      return credentials;
    } catch (error: unknown) {
      console.error("Error fetching credentials by reference code:", error);
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "Failed to fetch credentials",
        500,
      );
    }
  }
}
