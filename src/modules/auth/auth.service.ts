import { AppError } from "../../core/error/app-error";
import { ErrorCode } from "../../core/types/errors";
import { IUserRepository } from "../users/domain/user.repository";
import {
  AuthRequestDTO,
  CreateCredentialsDTO,
  CredentialsDTO,
} from "./domain/auth";
import { IAuthRepository } from "./domain/auth.repository";
import { IAuthFactory } from "./auth.factory";

export interface IAuthService {
  authenticate(data: AuthRequestDTO): Promise<boolean>;
  createCredentials(data: CreateCredentialsDTO): Promise<CredentialsDTO>;
}

export class AuthService implements IAuthService {
  constructor(
    private readonly usersRepository: IUserRepository,
    private readonly authRepository: IAuthRepository,
    private readonly authFactory: IAuthFactory,
  ) {}

  async authenticate(data: AuthRequestDTO): Promise<boolean> {
    const user = await this.usersRepository.getUserByEmail(data.email);
    if (!user) {
      return false;
    }
    return user.password === data.password;
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
}
