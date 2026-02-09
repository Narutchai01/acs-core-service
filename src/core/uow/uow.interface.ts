import { IUserRepository } from "../../modules/users/domain/user.repository";
import { IProfessorRepository } from "../../modules/professors/domain/professor.repository";

export interface IUnitOfWork {
  user: IUserRepository;
  professor: IProfessorRepository;

  commit(): Promise<void>;
  rollback(): Promise<void>;

  runInTransaction<T>(fn: (uow: IUnitOfWork) => Promise<T>): Promise<T>;
}
