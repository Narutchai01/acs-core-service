import { ForgetPasswordSchema } from "./auth";

export interface IAuthRepository {
  createCredentialsForgetPassword(
    userID: number,
  ): Promise<ForgetPasswordSchema>;
  getCredentialsByReferenceCode(
    referenceCode: string,
  ): Promise<ForgetPasswordSchema | null>;
  syncCredentialAccount(userID: number, passwordHash: string): Promise<void>;
}
