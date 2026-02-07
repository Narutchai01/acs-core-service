import { Elysia, t } from "elysia";
import { UserService } from "./user.service";
import { UserRepository } from "../../infrastructure/user.repository";
import { prisma } from "../../lib/db";
import { UserSchema } from "./domain/user";

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);

export const userController = new Elysia({ prefix: "/users" }).decorate(
  "userService",
  userService,
);

userController
  .get(
    "/",
    async ({ userService }) => {
      return await userService.getUsers();
    },
    {
      response: t.Array(UserSchema),
    },
  )
  .post(
    "/super-user",
    async ({ userService, body }) => {
      return await userService.createUser(body);
    },
    {
      body: t.Omit(UserSchema, ["id", "createdAt", "updatedAt"]),
      response: UserSchema,
    },
  );
