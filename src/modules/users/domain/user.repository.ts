import {
  CreateUserModel,
  CreateUserRoleModel,
  UpdateUserModel,
  User,
  UserRole,
} from "./user";

export interface IUserRepository {
  createUser(data: CreateUserModel): Promise<User>;
  getUsers(): Promise<User[]>;
  assignUserRole(data: CreateUserRoleModel): Promise<UserRole>;
  updateUser(userID: number, data: UpdateUserModel): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: number): Promise<User | null>;
}
