import { CreateSuperUserDTO, UserDTO } from "./domain/user";
import { IUserRepository } from "./domain/user.repository";
import { IUserFactory } from "./user.factory";

export abstract class IUserService {
  abstract createSuperUser(data: CreateSuperUserDTO): Promise<UserDTO>;
  abstract getUsers(): Promise<UserDTO[]>;
}

export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: IUserFactory,
  ) {}

  async createSuperUser(data: CreateSuperUserDTO): Promise<UserDTO> {
    const hashedPassword = Bun.hash(data.password);
    const user = await this.userRepository.createUser({
      ...data,
      password:
        hashedPassword !== undefined && hashedPassword !== null
          ? String(hashedPassword)
          : null,
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
