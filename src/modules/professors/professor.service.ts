import { SupabaseService } from "../../core/utils/supabase";
import { IUserRepository } from "../users/domain/user.repository";
import {
  CreateProfessorDTO,
  ProfessorDTO,
  ProfessorQueryParams,
} from "./domain/professor";
import { IProfessorRepository } from "./domain/professor.repository";
import { IProfessorFactory } from "./profressor.factory";
import { CreateUserModel } from "../users/domain/user";
import { Prisma } from "../../generated/prisma/client";
interface IProfessorService {
  createProfessor(data: CreateProfessorDTO): Promise<ProfessorDTO>;
  getProfessors(query: ProfessorQueryParams): Promise<ProfessorDTO[]>;
}

export class ProfessorService implements IProfessorService {
  constructor(
    private readonly professorRepository: IProfessorRepository,
    private readonly userRepository: IUserRepository,
    private readonly professorFactory: IProfessorFactory,
    private readonly storage: SupabaseService,
  ) {}

  async createProfessor(data: CreateProfessorDTO): Promise<ProfessorDTO> {
    const {
      imageFile,
      firstNameTh,
      firstNameEn,
      lastNameTh,
      lastNameEn,
      email,
      ...rawProfessorData
    } = data;
    let pathImage: string | null = null;
    try {
      if (imageFile) {
        pathImage = await this.storage.uploadFile(imageFile, "professors");
      }

      const userData: CreateUserModel = {
        firstNameTh,
        lastNameTh,
        firstNameEn,
        lastNameEn,
        email,
        imageUrl: pathImage,
        createdBy: 0,
        updatedBy: 0,
      };

      const user = await this.userRepository.createUser(userData);

      const professorData: Prisma.ProfessorCreateInput = {
        ...rawProfessorData,
        user: {
          connect: {
            id: user.id,
          },
        },
        createdBy: 0,
        updatedBy: 0,
      };

      const professor =
        await this.professorRepository.createProfessor(professorData);

      return this.professorFactory.mapProfessorToDTO(professor);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getProfessors(query: ProfessorQueryParams): Promise<ProfessorDTO[]> {
    const professors = await this.professorRepository.getProfessors(query);
    return this.professorFactory.mapPrfessorListToDTO(professors);
  }
}
