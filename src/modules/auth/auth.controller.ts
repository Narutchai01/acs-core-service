import Elysia from "elysia";
import { AuthService } from "./auth.service";
import { AuthRepository } from "../../infrastructure/auth.repository";
import { AuthFactory } from "./auth.factory";
import { UserRepository } from "../../infrastructure/user.repository";
import { prisma } from "../../lib/db";
import { authDocs } from "./auth.docs";
import { HttpStatusCode } from "../../core/types/http";
import { success } from "../../core/interceptor/response";
import { auth } from "../../lib/auth";

const authRepository = new AuthRepository(prisma);
const userRepository = new UserRepository(prisma);
const authFactory = new AuthFactory();

export const authService = new AuthService(
  userRepository,
  authRepository,
  authFactory,
);
export const AuthController = (app: Elysia) =>
  app.group("/auth", (app) =>
    app
      .decorate("authService", authService)
      .post(
        "/login",
        async ({ body, set, request }) => {
          const result = await auth.api.signInEmail({
            body,
            headers: request.headers,
            returnHeaders: true,
            returnStatus: true,
          });
          const response = result.response;
          const token =
            response && typeof response === "object" && "token" in response
              ? response.token
              : null;

          if (!token) {
            throw new Error("Failed to create Better Auth session");
          }

          const sessionCookie = result.headers?.get("set-cookie");
          if (sessionCookie) {
            set.headers["set-cookie"] = sessionCookie;
          }

          set.status = HttpStatusCode.OK;
          return success(
            { accessToken: token, refreshToken: token },
            "Authenticated successfully",
            HttpStatusCode.OK,
          );
        },
        authDocs.login,
      )
      .post(
        "/logout",
        async ({ cookie: { accessToken }, request, set }) => {
          await auth.api.signOut({
            headers: request.headers,
          });
          accessToken.remove();
          set.status = HttpStatusCode.OK;
          return success(
            null,
            "Logged out successfully",
            HttpStatusCode.OK,
          );
        },
        authDocs.logout,
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
