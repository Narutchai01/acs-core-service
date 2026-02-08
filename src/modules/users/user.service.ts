import { CreateUserDTO, User } from "./domain/user";
import { IUserRepository } from "./domain/user.repository";

export abstract class IUserService {
  abstract createSuperUser(data: CreateUserDTO): Promise<User>;
  abstract getUsers(): Promise<User[]>;
}

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async createSuperUser(data: CreateUserDTO): Promise<User> {
    const user = await this.userRepository.createUser({
      ...data,
      firstNameEn: (data.firstNameEn as string) ?? null,
      lastNameEn: (data.lastNameEn as string) ?? null,
      nickName: (data.nickName as string) ?? null,
      createdBy: 0,
      updatedBy: 0,
    });
    return user;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.getUsers();
    return users;
  }
}
