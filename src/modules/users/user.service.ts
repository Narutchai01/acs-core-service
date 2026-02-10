import { CreateUserDTO, UserDTO } from "./domain/user";
import { IUserRepository } from "./domain/user.repository";
import { IUserFactory } from "./user.factory";

export abstract class IUserService {
  abstract createSuperUser(data: CreateUserDTO): Promise<UserDTO>;
  abstract getUsers(): Promise<UserDTO[]>;
}

export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: IUserFactory,
  ) {}

  async createSuperUser(data: CreateUserDTO): Promise<UserDTO> {
    const user = await this.userRepository.createUser({
      ...data,
      firstNameEn: (data.firstNameEn as string) ?? null,
      lastNameEn: (data.lastNameEn as string) ?? null,
      nickName: (data.nickName as string) ?? null,
      createdBy: 0,
      updatedBy: 0,
    });
    return this.userFactory.mapUserToDTO(user);
  }

  async getUsers(): Promise<UserDTO[]> {
    const users = await this.userRepository.getUsers();
    return this.userFactory.mapUserListToDTO(users);
  }
}
