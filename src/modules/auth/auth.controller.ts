import Elysia from "elysia";
import { AuthService } from "./auth.service";
import { AuthRepository } from "../../infrastructure/auth.repository";
import { AuthFactory } from "./auth.factory";
import { UserRepository } from "../../infrastructure/user.repository";
import { prisma } from "../../lib/db";
import { authDocs } from "./auth.docs";
import { HttpStatusCode } from "../../core/types/http";
import { success } from "../../core/interceptor/response";
import { UserFactory } from "../users/user.factory";
import { jwtPlugin } from "../../core/plugins/jwt";
import { config } from "../../core/config/config";

const authRepository = new AuthRepository(prisma);
const userRepository = new UserRepository(prisma);
const authFactory = new AuthFactory();
const userFactory = new UserFactory();

export const authService = new AuthService(
  userRepository,
  authRepository,
  authFactory,
  userFactory,
);
export const AuthController = (app: Elysia) =>
  app.group("/auth", (app) =>
    app
      .use(jwtPlugin)
      .decorate("authService", authService)
      .post(
        "/login",
        async ({ body, set, jwt, cookie: { accessToken } }) => {
          const user = await authService.authenticate(body);

          const token = await jwt.sign({ id: user.userID, roles: user.roles });

          set.status = HttpStatusCode.OK;

          accessToken.set({
            value: token,
            httpOnly: true,
            secure: config.ENVIRONMENT === "production",
          });
          return success(
            { accessToken: token, refreshToken: token },
            "Authenticated successfully",
            HttpStatusCode.OK,
          );
        },
        authDocs.login,
      )
      .post(
        "/credentials",
        async ({ body, set }) => {
          const credentials = await authService.createCredentials(body);
          set.status = HttpStatusCode.CREATED;
          return success(
            credentials,
            "Created credentials successfully",
            HttpStatusCode.CREATED,
          );
        },
        authDocs.createCredentials,
      )
      .get(
        "/credentials/:referenceCode",
        async ({ params, set }) => {
          const credentials = await authService.getCredentialsByReferenceCode(
            params.referenceCode,
          );
          if (!credentials) {
            return success(null);
          }

          set.status = HttpStatusCode.OK;
          return success(
            credentials,
            "Fetched credentials successfully",
            HttpStatusCode.OK,
          );
        },
        authDocs.getCredentialsByReferenceCode,
      )
      .post(
        "/reset-password/:referenceCode",
        async ({ params, body, set }) => {
          await authService.resetPassword(
            params.referenceCode,
            body.newPassword,
          );
          set.status = HttpStatusCode.OK;
          return success(
            null,
            "Reset password successfully",
            HttpStatusCode.OK,
          );
        },
        authDocs.resetPassword,
      ),
  );
