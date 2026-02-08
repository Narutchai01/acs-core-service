import { IUserRepository } from "../../modules/users/domain/user.repository";

export interface IUnitOfWork {
  user: IUserRepository; // เข้าถึง Repo ผ่าน UoW
  //   student: IStudentRepository; // เข้าถึง Repo ผ่าน UoW

  // คำสั่งจัดการ Transaction
  commit(): Promise<void>;
  rollback(): Promise<void>;

  // คำสั่งรัน Logic ภายใน Transaction (แบบ Callback)
  runInTransaction<T>(fn: (uow: IUnitOfWork) => Promise<T>): Promise<T>;
}
