import { PrismaClient } from "../generated/prisma/client";
import { IAuthRepository } from "../modules/auth/domain/auth.repository";
import { ForgetPasswordSchema } from "../modules/auth/domain/auth";

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
}
