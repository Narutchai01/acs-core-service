import { Elysia, t } from "elysia";
import { UserService } from "./user.service";
import { UserRepository } from "../../infrastructure/user.repository";
import { prisma } from "../../lib/db";
import { UserSchema } from "./domain/user";
import { responseTemplate, mapResponse } from "../../core/interceptor/response";

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);

export const userController = new Elysia({ prefix: "/users" })
  .decorate("userService", userService)
  .get(
    "/",
    async ({ userService, set }) => {
      const users = await userService.getUsers();
      return mapResponse(users, "Users retrieved successfully");
    },
    {
      detail: {
        summary: "Get all users",
        description: "Retrieve a list of all users in the system",
        tags: ["Users "],
      },
      response: responseTemplate,
    },
  )
  .post(
    "/super-user",
    async ({ userService, body }) => {
      return await userService.createUser(body);
    },
    {
      detail: {
        summary: "Create super user",
        description: "Create a new super user with the provided information",
        tags: ["Users "],
      },
      body: t.Omit(UserSchema, ["id", "createdAt", "updatedAt"]),
      response: UserSchema,
    },
  );
