import { SupabaseService } from "../../core/utils/supabase";
import { Prisma } from "../../generated/prisma/client";
import { CreateStudentDTO, StudentDTO } from "./domain/student";
import { IStudentRepository } from "./domain/student.repository";
import { IUserRepository } from "../users/domain/user.repository";
import { CreateUserModel } from "../users/domain/user";
import { AppError } from "../../core/error/app-error";
import { ErrorCode } from "../../core/types/errors";
import { IStudentFactory } from "./student.factory";

interface IStudentService {
  createStudent(data: CreateStudentDTO): Promise<StudentDTO>;
}

export class StudentService implements IStudentService {
  constructor(
    private readonly studentRepository: IStudentRepository,
    private readonly userRepository: IUserRepository,
    private readonly storage: SupabaseService,
    private readonly studentFactory: IStudentFactory,
  ) {}

  async createStudent(data: CreateStudentDTO): Promise<StudentDTO> {
    const {
      imageFile,
      email,
      nickName,
      firstNameTh,
      lastNameTh,
      firstNameEn,
      lastNameEn,
      ...studentData
    } = data;
    let imagePath: string | null = null;
    try {
      if (imageFile) {
        imagePath = await this.storage.uploadFile(imageFile, "students");
      }

      const rawUserData: CreateUserModel = {
        email,
        firstNameTh,
        lastNameTh,
        nickName,
        firstNameEn,
        lastNameEn,
        password: null,
        imageUrl: imagePath,
        createdBy: 0,
        updatedBy: 0,
      };

      const user = await this.userRepository.createUser(rawUserData);

      if (!user) {
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          "Failed to create user for student",
        );
      }

      const rawStudentData: Prisma.StudentCreateInput = {
        ...studentData,
        createdBy: 0,
        updatedBy: 0,
        user: {
          connect: { id: user.id },
        },
      };

      const student =
        await this.studentRepository.createStudent(rawStudentData);

      if (!student) {
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          "Failed to create student",
        );
      }

      return this.studentFactory.MapStudentToDTO(student);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
