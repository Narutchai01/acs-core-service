import Elysia from "elysia";
import { AuthService } from "./auth.service";
import { AuthRepository } from "../../infrastructure/auth.repository";
import { AuthFactory } from "./auth.factory";
import { UserRepository } from "../../infrastructure/user.repository";
import { prisma } from "../../lib/db";
import { authDocs } from "./auth.docs";

const authRepository = new AuthRepository(prisma);
const userRepository = new UserRepository(prisma);
const authFactory = new AuthFactory();

export const authService = new AuthService(
  userRepository,
  authRepository,
  authFactory,
);
export const AuthController = new Elysia({ prefix: "/auth" })
  .decorate("authService", authService)
  .post(
    "/credentials",
    async ({ body }) => {
      const credentials = await authService.createCredentials(body);
      return credentials;
    },
    authDocs.createCredentials,
  );
