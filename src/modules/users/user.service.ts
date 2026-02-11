import { CreateSuperUserDTO, UserDTO } from "./domain/user";
import { IUserRepository } from "./domain/user.repository";
import { IUserFactory } from "./user.factory";

export interface IUserService {
  createSuperUser(data: CreateSuperUserDTO): Promise<UserDTO>;
  getUsers(): Promise<UserDTO[]>;
  getUserById(id: number): Promise<UserDTO | null>;
}

export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: IUserFactory,
  ) {}

  async createSuperUser(data: CreateSuperUserDTO): Promise<UserDTO> {
    const hashedPassword = await Bun.password.hash(data.password);
    const user = await this.userRepository.createUser({
      ...data,
      password: hashedPassword ?? null,
      createdBy: 0,
      updatedBy: 0,
    });
    return this.userFactory.mapUserToDTO(user);
  }

  async getUsers(): Promise<UserDTO[]> {
    const users = await this.userRepository.getUsers();
    return this.userFactory.mapUserListToDTO(users);
  }

  async getUserById(id: number): Promise<UserDTO | null> {
    return this.userRepository.getUserById(id).then((user) => {
      if (!user) {
        return null;
      }
      return this.userFactory.mapUserToDTO(user);
    });
  }
}
