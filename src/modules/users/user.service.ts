import { CreateUser, User } from "./domain/user";
import { IUserRepository } from "./domain/user.repository";

export abstract class IUserService {
  abstract createUser(data: CreateUser): Promise<User>;
  abstract getUsers(): Promise<User[]>;
}

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(data: CreateUser): Promise<User> {
    const user = await this.userRepository.createUser({
      ...data,
      firstNameEn: (data.firstNameEn as string) ?? null,
      lastNameEn: (data.lastNameEn as string) ?? null,
      nickName: (data.nickName as string) ?? null,
      imageUrl: (data.imageUrl as string) ?? null,
      password: (data.password as string) ?? null,
    });
    return user;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.getUsers();
    return users;
  }
}
