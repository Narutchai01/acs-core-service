import { AppError } from "../../core/error/app-error";
import { ErrorCode } from "../../core/types/errors";
import { IUserRepository } from "../users/domain/user.repository";
import {
  AuthRequestDTO,
  CreateCredentialsDTO,
  CredentialsDTO,
  ForgetPasswordSchema,
} from "./domain/auth";
import { IAuthRepository } from "./domain/auth.repository";
import { IAuthFactory } from "./auth.factory";
import { HttpStatusCode } from "../../core/types/http";
import { UserDTO } from "../users/domain/user";
import { IUserFactory } from "../users/user.factory";

export interface IAuthService {
  authenticate(data: AuthRequestDTO): Promise<UserDTO>;
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
    private readonly userFactory: IUserFactory,
  ) {}

  async authenticate(data: AuthRequestDTO): Promise<UserDTO> {
    try {
      const user = await this.usersRepository.getUserByEmail(data.email);
      if (!user) {
        throw new AppError(ErrorCode.NOT_FOUND_ERROR, "User not found");
      }

      if (!user.password) {
        throw new AppError(
          ErrorCode.AUTHENTICATION_ERROR,
          "Password not set for user",
        );
      }

      // Assuming user.password is the hashed password stored in the database
      const isPasswordValid = await Bun.password.verify(
        data.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new AppError(ErrorCode.AUTHENTICATION_ERROR, "Invalid password");
      }

      return this.userFactory.mapUserToDTO(user);
    } catch (error) {
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        error instanceof Error ? error.message : "Authentication failed",
      );
    }
  }

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
    let credentials: ForgetPasswordSchema | null = null;
    try {
      credentials =
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

      const hashedPassword = await Bun.password.hash(newPassword);

      await this.usersRepository.updateUser(credentials.userID, {
        password: hashedPassword,
      });
    } catch (error) {
      console.log(error);
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        error instanceof Error ? error.message : "Failed to reset password",
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
