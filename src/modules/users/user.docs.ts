import { CreateUserDTO, UserDTO } from "./domain/user";
import { mapResponse } from "../../core/interceptor/response";
import { t } from "elysia";

export const userDocs = {
  createUser: {
    detail: {
      summary: "Create super user",
      description: "Create a new super user with the provided information",
      tags: ["Users "],
    },
    body: CreateUserDTO,
    response: mapResponse(UserDTO),
  },
  getUsers: {
    detail: {
      summary: "Get all users",
      description: "Retrieve a list of all users in the system",
      tags: ["Users "],
    },
    response: mapResponse(t.Array(UserDTO)),
  },
};
