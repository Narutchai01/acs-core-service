import { CreateCredentialsDTO, ResetPasswordDTO } from "./domain/auth";
import { IPasswordResetProvider } from "./password-reset.provider";

export interface IAuthService {
  createCredentials(
    data: CreateCredentialsDTO,
    headers: Headers,
  ): Promise<void>;
  resetPassword(
    token: string,
    data: ResetPasswordDTO,
    headers: Headers,
  ): Promise<void>;
}

export class AuthService implements IAuthService {
  constructor(
    private readonly passwordResetProvider: IPasswordResetProvider,
    private readonly passwordResetRedirectURL: string,
  ) {}

  async createCredentials(
    data: CreateCredentialsDTO,
    headers: Headers,
  ): Promise<void> {
    await this.passwordResetProvider.requestPasswordReset({
      email: data.email,
      redirectTo: this.passwordResetRedirectURL,
      headers,
    });
  }

  async resetPassword(
    token: string,
    data: ResetPasswordDTO,
    headers: Headers,
  ): Promise<void> {
    await this.passwordResetProvider.resetPassword({
      token,
      newPassword: data.newPassword,
      headers,
    });
  }
}
