import { SupabaseService } from "../../core/utils/supabase";
import {
  CreateStudentDTO,
  StudentDTO,
  Student,
  StudentQueryParams,
  StudentUpdateDTO,
  BatchStudentResponseDTO,
  StudentCreatePayload,
  StudentUpdatePayload,
  CreateStudent,
} from "./domain/student";
import { parse } from "csv-parse/sync";
import * as xlsx from "xlsx";
import { Value } from "@sinclair/typebox/value";
import { Static } from "elysia";
import { IStudentRepository } from "./domain/student.repository";
import { IUserRepository } from "../users/domain/user.repository";
import { CreateUserModel, UpdateUserModel } from "../users/domain/user";
import { AppError } from "../../core/error/app-error";
import { ErrorCode } from "../../core/types/errors";
import { IStudentFactory } from "./student.factory";
import { PageableType } from "../../core/models";

interface IStudentService {
  createStudent(data: CreateStudentDTO, createdBy: number): Promise<StudentDTO>;
  getStudents(
    query: StudentQueryParams,
  ): Promise<PageableType<typeof StudentDTO>>;
  getStudentById(id: number): Promise<StudentDTO | null>;
  deleteStudent(id: number): Promise<StudentDTO>;
  updateStudent(studentID: number, data: StudentUpdateDTO): Promise<StudentDTO>;
  importStudentsFromFile(file: File, classBookID: number, userID: number): Promise<BatchStudentResponseDTO>;
}

export class StudentService implements IStudentService {
  constructor(
    private readonly studentRepository: IStudentRepository,
    private readonly userRepository: IUserRepository,
    private readonly storage: SupabaseService,
    private readonly studentFactory: IStudentFactory,
    // private readonly uowRepository: IUnitOfWork,
  ) {}

  async createStudent(
    data: CreateStudentDTO,
    createdBy: number,
  ): Promise<StudentDTO> {
    const {
      imageFile,
      email,
      nickName,
      firstNameTh,
      lastNameTh,
      firstNameEn,
      lastNameEn,
      skills,
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
        imageUrl: imagePath,
        createdBy: createdBy || 0,
        updatedBy: createdBy || 0,
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
        createdBy: createdBy || 0,
        updatedBy: createdBy || 0,
      });

      if (!role) {
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          "Failed to assign role to student user",
        );
      }

      const rawStudentData: StudentCreatePayload = {
        ...studentData,
        skills: skills ? skills.join(",") : null,
        createdBy: createdBy || 0,
        updatedBy: createdBy || 0,
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

  async getStudents(
    query: StudentQueryParams,
  ): Promise<PageableType<typeof StudentDTO>> {
    const [students, countStudents] = await Promise.all([
      this.studentRepository.getStudents(query),
      this.studentRepository.countStudents(query),
    ]);

    return {
      rows: students.map((student) =>
        this.studentFactory.MapStudentToDTO(student),
      ),
      totalRecords: countStudents,
      page: query.page || 1,
      pageSize: query.pageSize || 10,
    };
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

  async getStudentByUserId(userId: number): Promise<StudentDTO | null> {
    try {
      const student = await this.studentRepository.getStudentByUserId(userId);
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
      classBookID,
      skills,
      ...userData
    } = data;
    let imagePath: string | undefined = undefined;
    let student: Student;
    try {
      if (imageFile) {
        imagePath = await this.storage.uploadFile(imageFile, "students");
      }

      const updatedUserData: UpdateUserModel = {
        ...(imagePath && { imageUrl: imagePath }),
        ...userData,
        updatedBy: 0,
      };

      const updateStudentData: StudentUpdatePayload = {
        studentCode,
        linkedin,
        github,
        facebook,
        instagram,
        classBookID,
        skills: skills ? skills.join(",") : null,
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

  async importStudentsFromFile(file: File, classBookID: number, userID: number): Promise<BatchStudentResponseDTO> {
    const isCSV = file.name.endsWith(".csv") || file.type === "text/csv";
    const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");

    if (!isCSV && !isExcel) {
      throw new Error("Invalid file format. Only CSV and Excel are allowed.");
    }

    let records: Record<string, string>[] = [];

    if (isCSV) {
      const text = await file.text();
      records = parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } else {
      const buffer = await file.arrayBuffer();
      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rawRecords = xlsx.utils.sheet_to_json<Record<string, string>>(sheet, { raw: false, defval: "" });

      records = rawRecords.map((row) => {
        const trimmedRow: Record<string, string> = {};
        for (const key in row) {
          trimmedRow[key.trim()] = String(row[key]).trim();
        }
        return trimmedRow;
      });
    }

    if (records.length === 0) {
      throw new Error("File is empty or contains no valid data rows.");
    }

    const validRecords: (Static<typeof CreateStudent> & { studentCode: string })[] = [];
    const failedRecords: { row: number; reason: string }[] = [];
    const duplicateRecords: string[] = [];
    const studentCodesToValidate: string[] = [];

    for (let i = 0; i < records.length; i++) {
      const rowNum = i + 1;
      const row = records[i];
      const parsedRow: Record<string, unknown> = {};
      for (const key in row) {
        if (row[key] === "") {
          parsedRow[key] = undefined;
        } else {
          parsedRow[key] = row[key];
        }
      }
      parsedRow.skills = row.skills ? row.skills.split(",").map(s => s.trim()).filter(s => s !== "") : undefined;

      if (!Value.Check(CreateStudent, parsedRow)) {
        const errors = [...Value.Errors(CreateStudent, parsedRow)];
        failedRecords.push({
          row: rowNum,
          reason: `Invalid format: ${errors.map((e) => e.path + " " + e.message).join(", ")}`,
        });
        continue;
      }

      validRecords.push(parsedRow);
      studentCodesToValidate.push(parsedRow.studentCode);
    }

    let successfulRecords = 0;

    if (studentCodesToValidate.length > 0) {
      const existingCodes = await this.studentRepository.getStudentCodes(studentCodesToValidate);
      const existingCodeSet = new Set(existingCodes);

      for (const record of validRecords) {
        if (existingCodeSet.has(record.studentCode)) {
          duplicateRecords.push(record.studentCode);
        } else {
          const {
            linkedin,
            github,
            facebook,
            instagram,
            studentCode,
            skills,
            ...userData
          } = record;

          const rawUserData: CreateUserModel = {
            ...userData,
            createdBy: userID,
            updatedBy: userID,
          };

          const user = await this.userRepository.createUser(rawUserData);

          if (!user) {
            continue;
          }

          const rawStudentData: StudentCreatePayload = {
            linkedin: linkedin || null,
            github: github || null,
            facebook: facebook || null,
            instagram: instagram || null,
            studentCode,
            classBookID,
            skills: skills ? skills.join(",") : null,
            createdBy: userID,
            updatedBy: userID,
            userID: user.id,
          };

          const student = await this.studentRepository.createStudent(rawStudentData);
          if (student) {
            successfulRecords++;
          }
        }
      }
    }

    return {
      totalRecords: records.length,
      successfulRecords,
      failedRecords,
      duplicateRecords,
    };
  }
}
