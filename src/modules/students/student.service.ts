import { SupabaseService } from "../../core/utils/supabase";
import { Prisma } from "../../generated/prisma/client";
import {
  CreateStudentDTO,
  StudentDTO,
  Student,
  StudentQueryParams,
  StudentUpdateDTO,
} from "./domain/student";
import { IStudentRepository } from "./domain/student.repository";
import { IUserRepository } from "../users/domain/user.repository";
import { CreateUserModel } from "../users/domain/user";
import { AppError } from "../../core/error/app-error";
import { ErrorCode } from "../../core/types/errors";
import { IStudentFactory } from "./student.factory";

interface IStudentService {
  createStudent(data: CreateStudentDTO): Promise<StudentDTO>;
  getStudents(query: StudentQueryParams): Promise<StudentDTO[]>;
  getStudentById(id: number): Promise<StudentDTO | null>;
  deleteStudent(id: number): Promise<StudentDTO>;
  updateStudent(studentID: number, data: StudentUpdateDTO): Promise<StudentDTO>;
}

export class StudentService implements IStudentService {
  constructor(
    private readonly studentRepository: IStudentRepository,
    private readonly userRepository: IUserRepository,
    private readonly storage: SupabaseService,
    private readonly studentFactory: IStudentFactory,
    // private readonly uowRepository: IUnitOfWork,
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

      const role = await this.userRepository.assignUserRole({
        userID: user.id,
        roleID: 2,
        createdBy: 0,
        updatedBy: 0,
      });

      if (!role) {
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          "Failed to assign role to student user",
        );
      }

      const rawStudentData: Prisma.StudentUncheckedCreateInput = {
        ...studentData,
        createdBy: 0,
        updatedBy: 0,
        userID: user.id,
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

  async getStudents(query: StudentQueryParams): Promise<StudentDTO[]> {
    const students = await this.studentRepository.getStudents(query);
    return students.map((student) =>
      this.studentFactory.MapStudentToDTO(student),
    );
  }

  async getStudentById(id: number): Promise<StudentDTO | null> {
    try {
      const student = await this.studentRepository.getStudentById(id);
      if (!student) {
        return null;
      }
      return this.studentFactory.MapStudentToDTO(student);
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async deleteStudent(id: number): Promise<StudentDTO> {
    const student = await this.studentRepository.deleteStudent(id);
    return this.studentFactory.MapStudentToDTO(student);
  }

  async updateStudent(
    studentID: number,
    data: StudentUpdateDTO,
  ): Promise<StudentDTO> {
    const {
      imageFile,
      studentCode,
      linkedin,
      github,
      facebook,
      instagram,
      ...userData
    } = data;
    let imagePath: string | undefined = undefined;
    let student: Student;
    try {
      if (imageFile) {
        imagePath = await this.storage.uploadFile(imageFile, "students");
      }

      const updatedUserData: Prisma.UserUncheckedUpdateInput = {
        ...(imagePath && { imageUrl: imagePath }),
        ...userData,
        updatedBy: 0,
      };

      const updateStudentData: Prisma.StudentUncheckedUpdateInput = {
        studentCode,
        linkedin,
        github,
        facebook,
        instagram,
        updatedBy: 0,
      };

      student = await this.studentRepository.updateStudent(
        studentID,
        updateStudentData,
      );

      const updateUser = await this.userRepository.updateUser(
        student.userID,
        updatedUserData,
      );

      if (!updateUser) {
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          "Failed to update user for student",
        );
      }

      student.user = updateUser;

      return this.studentFactory.MapStudentToDTO(student);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
