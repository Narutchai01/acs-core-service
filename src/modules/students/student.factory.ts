import { Student, StudentDTO, BatchStudentResponseDTO } from "./domain/student";
import { IUserFactory } from "../users/user.factory";

export interface IStudentFactory {
  MapStudentToDTO(student: Student): StudentDTO;
  MapStudentListToDTO(studentList: Student[]): StudentDTO[];
  mapBatchStudentResponse(
    totalRecords: number,
    successfulRecords: number,
    failedRecords: { row: number; reason: string }[],
    duplicateRecords: string[],
  ): BatchStudentResponseDTO;
}

export class StudentFactory implements IStudentFactory {
  constructor(private readonly userFactory: IUserFactory) {}
  MapStudentToDTO(student: Student): StudentDTO {
    return {
      id: student.id,
      studentCode: student.studentCode,
      linkedin: student.linkedin,
      github: student.github,
      facebook: student.facebook,
      instagram: student.instagram,
      classBookID: student.classBookID,
      skills: student.skills
        ? student.skills.split(",").map((skill) => skill.trim()).filter((s) => s !== "")
        : [],
      user: this.userFactory.mapUserToDTO(student.user),
    };
  }

  MapStudentListToDTO(studentList: Student[]): StudentDTO[] {
    return studentList.map((student) => this.MapStudentToDTO(student));
  }

  mapBatchStudentResponse(
    totalRecords: number,
    successfulRecords: number,
    failedRecords: { row: number; reason: string }[],
    duplicateRecords: string[],
  ): BatchStudentResponseDTO {
    return {
      totalRecords,
      successfulRecords,
      failedRecords,
      duplicateRecords,
    };
  }
}
