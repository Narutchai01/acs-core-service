import { Elysia, t } from "elysia";
import { UserService } from "./user.service";
import { UserRepository } from "../../infrastructure/user.repository";
import { prisma } from "../../lib/db";
import { User, UserSchema } from "./domain/user";
import { mapResponse, success } from "../../core/interceptor/response";

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);

export const userController = new Elysia({ prefix: "/users" })
  .decorate("userService", userService)
  .get(
    "/",
    async ({ userService, set }) => {
      const users = await userService.getUsers();
      return success<User[]>(users, "Users retrieved successfully");
    },
    {
      detail: {
        summary: "Get all users",
        description: "Retrieve a list of all users in the system",
        tags: ["Users "],
      },
      response: mapResponse(t.Array(UserSchema)),
    },
  )
  .post(
    "/super-user",
    async ({ userService, body }) => {
      const newUser = await userService.createUser(body);
      return success<User>(newUser, "Super user created successfully", 201);
    },
    {
      detail: {
        summary: "Create super user",
        description: "Create a new super user with the provided information",
        tags: ["Users "],
      },
      body: t.Omit(UserSchema, ["id", "createdAt", "updatedAt"]),
      response: mapResponse(UserSchema),
    },
  );
