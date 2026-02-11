import { ForgetPasswordSchema } from "./auth";

export interface IAuthRepository {
  createCredentialsForgetPassword(
    userID: number,
  ): Promise<ForgetPasswordSchema>;
}
