import { User, UserRole } from "./user";
import { Prisma } from "../../../generated/prisma/client";

export interface IUserRepository {
  createUser(data: Prisma.UserUncheckedCreateInput): Promise<User>;
  getUsers(): Promise<User[]>;
  assignUserRole(data: Prisma.UserRoleUncheckedCreateInput): Promise<UserRole>;
  updateUser(
    userID: number,
    data: Prisma.UserUncheckedUpdateInput,
  ): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
}
