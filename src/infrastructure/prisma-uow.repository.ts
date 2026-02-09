import { IUnitOfWork } from "../core/uow/uow.interface";
import { IUserRepository } from "../modules/users/domain/user.repository";
import { IProfessorRepository } from "../modules/professors/domain/professor.repository";
import { UserRepository } from "./user.repository";
import { PrismaClient } from "../generated/prisma/client";
import { ProfessorRepository } from "./profressor.repository";

export class PrismaUnitOfWorkRepository implements IUnitOfWork {
  private _userRepository?: IUserRepository;
  private _professorRepository?: IProfessorRepository;

  constructor(private readonly prisma: PrismaClient) {}
  get user(): IUserRepository {
    this._userRepository ??= new UserRepository(this.prisma);
    return this._userRepository;
  }

  get professor(): IProfessorRepository {
    this._professorRepository ??= new ProfessorRepository(this.prisma);
    return this._professorRepository;
  }

  async runInTransaction<T>(fn: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      const transactionUow = new PrismaUnitOfWorkRepository(tx as PrismaClient);
      return await fn(transactionUow);
    });
  }

  async commit(): Promise<void> {
    // No-op: Prisma handles commit automatically in $transaction
  }

  async rollback(): Promise<void> {
    // No-op: Prisma handles rollback automatically in $transaction
  }
}
