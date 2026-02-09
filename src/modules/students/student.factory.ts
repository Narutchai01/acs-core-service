import { Student, StudentDTO } from "./domain/student";
import { IUserFactory } from "../users/user.factory";

export interface IStudentFactory {
  MapStudentToDTO(student: Student): StudentDTO;
  MapStudentListToDTO(studentList: Student[]): StudentDTO[];
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
      user: this.userFactory.mapUserToDTO(student.user),
    };
  }

  MapStudentListToDTO(studentList: Student[]): StudentDTO[] {
    return studentList.map((student) => this.MapStudentToDTO(student));
  }
}
