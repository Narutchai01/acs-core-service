import { IUserRepository } from "../modules/users/domain/user.repository";
import { PrismaInstance } from "../lib/db";
import { User, UserRole } from "../modules/users/domain/user";
import { Prisma } from "../generated/prisma/client";

export class UserRepository implements IUserRepository {
  constructor(private readonly db: PrismaInstance) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.db.user.create({ data });
    return user as User;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.db.user.findMany();
    return users as User[];
  }

  async assignUserRole(
    data: Prisma.UserRoleUncheckedCreateInput,
  ): Promise<UserRole> {
    const userRole = await this.db.userRole.create({ data });
    return userRole;
  }
}
