import { Student, StudentDTO } from "./domain/student";

export interface IStudentFactory {
  MapStudentToDTO(student: Student): StudentDTO;
  MapStudentListToDTO(studentList: Student[]): StudentDTO[];
}

export class StudentFactory implements IStudentFactory {
  MapStudentToDTO(student: Student): StudentDTO {
    return {
      id: student.id,
      userID: student.userID,
      studentCode: student.studentCode,
      linkedin: student.linkedin,
      github: student.github,
      facebook: student.facebook,
      instagram: student.instagram,
      updatedAt: student.updatedAt as Date,
      user: student.user,
    };
  }

  MapStudentListToDTO(studentList: Student[]): StudentDTO[] {
    return studentList.map((student) => this.MapStudentToDTO(student));
  }
}
