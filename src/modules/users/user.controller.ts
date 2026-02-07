import { Elysia } from "elysia";
import { UserService } from "./user.service";
import { UserRepository } from "../../infrastructure/user.repository";
import { prisma } from "../../lib/db";
import { User } from "./domain/user";
import { success } from "../../core/interceptor/response";
import { userDocs } from "./user.docs";

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);

export const userController = new Elysia({ prefix: "/users" }).decorate(
  "userService",
  userService,
);

userController
  .get(
    "/",
    async ({ userService, set }) => {
      const users = await userService.getUsers();
      return success<User[]>(users, "Users retrieved successfully");
    },
    userDocs.getUsers,
  )
  .post(
    "/super-user",
    async ({ userService, body }) => {
      const newUser = await userService.createUser(body);
      return success<User>(newUser, "Super user created successfully", 201);
    },
    userDocs.createUser,
  );
