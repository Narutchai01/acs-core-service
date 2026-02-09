import { t, Static } from "elysia";
import { BaseModelSchema } from "../../../core/models";
import { TypeCourseSchema } from "../../../core/models/type-course";
import {
  CurriculumDTO,
  CurriculumSchema,
} from "../../curriculums/domain/curriculum";

const CommonCourseField = {
  courseCode: t.String(),
  courseNameTh: t.String(),
  courseNameEn: t.String(),
  credits: t.String(),
  detail: t.String(),
};

export const CourseSchema = t.Intersect([
  t.Object({
    id: t.Number(),
    ...CommonCourseField,
    typeCourseID: t.Number(),
    curriculumID: t.Number(),
    typeCourse: TypeCourseSchema,
    curriculum: t.Intersect([CurriculumSchema, BaseModelSchema]),
  }),
  BaseModelSchema,
]);

export const CourseDTO = t.Object({
  id: t.Number(),
  ...CommonCourseField,
  typeCourse: TypeCourseSchema,
  curriculum: CurriculumDTO,
});

export const CreateCourseDTO = t.Object({
  ...CommonCourseField,
  typeCourseID: t.Number(),
  curriculumID: t.Number(),
});

export type Course = Static<typeof CourseSchema>;
export type CreateCourseDTO = Static<typeof CreateCourseDTO>;
export type CourseDTO = Static<typeof CourseDTO>;
