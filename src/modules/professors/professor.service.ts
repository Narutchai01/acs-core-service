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
import { AppError } from "../../core/error/app-error";
import { ErrorCode } from "../../core/types/errors";
interface IProfessorService {
  createProfessor(data: CreateProfessorDTO): Promise<ProfessorDTO>;
  getProfessors(query: ProfessorQueryParams): Promise<ProfessorDTO[]>;
  getProfessorById(id: number): Promise<ProfessorDTO | null>;
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
    let expertFieldsString: string | null = "";
    let educationsString: string | null = "";
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

      if (!user) {
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          "Failed to create user for professor",
          500,
        );
      }

      const role = await this.userRepository.assignUserRole({
        userID: user.id,
        roleID: 3,
        createdBy: 0,
        updatedBy: 0,
      });

      if (!role) {
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          "Failed to assign role to student user",
        );
      }

      if (rawProfessorData.expertFields) {
        expertFieldsString = rawProfessorData.expertFields
          ?.split('"')
          .map((field) => field.trim())
          .join(",");
      }

      if (rawProfessorData.educations) {
        educationsString = rawProfessorData.educations
          ?.split('"')
          .map((edu) => edu.trim())
          .join("/");
      }

      const professorData: Prisma.ProfessorUncheckedCreateInput = {
        ...rawProfessorData,
        expertFields: expertFieldsString,
        academicPositionID: rawProfessorData.academicPositionID,
        educations: educationsString,
        userID: user.id,
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

  async getProfessorById(id: number): Promise<ProfessorDTO | null> {
    try {
      const professor = await this.professorRepository.getProfessorById(id);
      if (!professor) {
        return null;
      }
      console.log(professor);

      return this.professorFactory.mapProfessorToDTO(professor);
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }
}
