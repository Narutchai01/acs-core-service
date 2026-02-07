import { User } from "./user";
import { Prisma } from "../../../generated/prisma/client";

export abstract class IUserRepository {
  abstract createUser(data: Prisma.UserCreateInput): Promise<User>;
  abstract getUsers(): Promise<User[]>;
}
