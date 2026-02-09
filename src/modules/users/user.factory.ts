import { User, UserDTO } from "./domain/user";

export interface IUserFactory {
  mapUserToDTO(user: User): UserDTO;
  mapUserListToDTO(users: User[]): UserDTO[];
}

export class UserFactory implements IUserFactory {
  mapUserToDTO(user: User): UserDTO {
    return {
      id: user.id,
      firstNameTh: user.firstNameTh,
      lastNameTh: user.lastNameTh,
      firstNameEn: user.firstNameEn,
      lastNameEn: user.lastNameEn,
      email: user.email,
      nickName: user.nickName,
      imageUrl: user.imageUrl,
    };
  }
  mapUserListToDTO(users: User[]): UserDTO[] {
    return users.map((user) => this.mapUserToDTO(user));
  }
}
