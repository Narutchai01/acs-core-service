import { Student, StudentDTO } from "./domain/student";

export interface IStudentFactory {
  MapStudentToDTO(student: Student): StudentDTO;
  MapStudentListToDTO(studentList: Student[]): StudentDTO[];
}

export class StudentFactory implements IStudentFactory {
  MapStudentToDTO(student: Student): StudentDTO {
    return {
      id: student.id,
      studentCode: student.studentCode,
      linkedin: student.linkedin,
      github: student.github,
      facebook: student.facebook,
      instagram: student.instagram,
      user: student.user,
    };
  }

  MapStudentListToDTO(studentList: Student[]): StudentDTO[] {
    return studentList.map((student) => this.MapStudentToDTO(student));
  }
}
