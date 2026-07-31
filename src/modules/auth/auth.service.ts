import { AppError } from "../../core/error/app-error";
import { ErrorCode } from "../../core/types/errors";
import { IUserRepository } from "../users/domain/user.repository";
import {
  CreateCredentialsDTO,
  CredentialsDTO,
} from "./domain/auth";
import { IAuthRepository } from "./domain/auth.repository";
import { IAuthFactory } from "./auth.factory";
import { HttpStatusCode } from "../../core/types/http";
import { hashPassword } from "../../lib/auth";

export interface IAuthService {
  createCredentials(data: CreateCredentialsDTO): Promise<CredentialsDTO>;
  getCredentialsByReferenceCode(
    referenceCode: string,
  ): Promise<CredentialsDTO | null>;
  resetPassword(referebceCode: string, newPassword: string): Promise<void>;
}

export class AuthService implements IAuthService {
  constructor(
    private readonly usersRepository: IUserRepository,
    private readonly authRepository: IAuthRepository,
    private readonly authFactory: IAuthFactory,
  ) {}

  async createCredentials(data: CreateCredentialsDTO): Promise<CredentialsDTO> {
    const user = await this.usersRepository.getUserByEmail(data.email);
    if (!user) {
      throw new AppError(ErrorCode.NOT_FOUND_ERROR, "User not found");
    }
    const credentials =
      await this.authRepository.createCredentialsForgetPassword(user.id);

    if (!credentials) {
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "Failed to create credentials",
      );
    }

    return this.authFactory.mapCredentialsToDTO(credentials);
  }

  async getCredentialsByReferenceCode(
    referenceCode: string,
  ): Promise<CredentialsDTO | null> {
    try {
      const credentials =
        await this.authRepository.getCredentialsByReferenceCode(referenceCode);
      if (!credentials) {
        return null;
      }
      return this.authFactory.mapCredentialsToDTO(credentials);
    } catch (error) {
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        error instanceof Error ? error.message : "Failed to fetch credentials",
        HttpStatusCode.NOT_FOUND,
      );
    }
  }

  async resetPassword(
    referebceCode: string,
    newPassword: string,
  ): Promise<void> {
    try {
      const credentials =
        await this.authRepository.getCredentialsByReferenceCode(referebceCode);

      if (!credentials) {
        throw new AppError(
          ErrorCode.NOT_FOUND_ERROR,
          "Credentials not found",
          HttpStatusCode.NOT_FOUND,
        );
      }

      const hashedPassword = await hashPassword(newPassword);

      await this.authRepository.syncCredentialAccount(
        credentials.userID,
        hashedPassword,
      );
    } catch (error) {
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        error instanceof Error ? error.message : "Failed to reset password",
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
