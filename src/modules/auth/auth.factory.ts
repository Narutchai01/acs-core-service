import { CredentialsDTO, ForgetPasswordSchema } from "./domain/auth";

export interface IAuthFactory {
  mapCredentialsToDTO(credentials: ForgetPasswordSchema): CredentialsDTO;
}

export class AuthFactory implements IAuthFactory {
  mapCredentialsToDTO(credentials: ForgetPasswordSchema): CredentialsDTO {
    return {
      refferenceCode: credentials.refferenceCode,
      expiredAt: credentials.expiredAt,
    };
  }
}
