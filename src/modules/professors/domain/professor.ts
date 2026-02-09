import { t, Static } from "elysia";
import { BaseModelSchema, CommonQueryParams } from "../../../core/models";
import { CommonUserFields, UserSchema } from "../../users/domain/user";
import { AcademicPositionSchema } from "../../../core/models/academic";

export const CommonProfessorFields = {
  phone: t.String(),
  profRoom: t.String(),
};

export const ProfessorSchema = t.Intersect([
  t.Object({
    id: t.Number(),
    userID: t.Number(),
    expertFields: t.Optional(t.Nullable(t.String())),
    educations: t.Optional(t.Nullable(t.String())),
    academicPositionID: t.Number(),
    academicPosition: t.Intersect([AcademicPositionSchema]),
    ...CommonProfessorFields,
    user: UserSchema,
  }),
  BaseModelSchema,
]);

export const CreateProfrssorDTO = t.Object({
  ...CommonProfessorFields,
  ...CommonUserFields,
  imageFile: t.Optional(
    t.File({
      examples: ["professor1.jpg"],
    }),
  ),
  expertFields: t.Optional(
    t.Nullable(
      t.String({
        examples: ["Computer Science, Data Science, AI,Machine Learning"],
      }),
    ),
  ),
  educations: t.Optional(
    t.Nullable(
      t.String({
        examples: [
          "Ph.D. in Computer Science / M.Sc. in Data Science / B.Eng. in Software Engineering",
        ],
      }),
    ),
  ),
  academicPositionID: t.Numeric(),
});

export const ProfessorDTO = t.Object({
  id: t.Number(),
  ...CommonProfessorFields,
  expertFields: t.Array(t.String()),
  educations: t.Array(t.String()),
  user: UserSchema,
  academicPosition: AcademicPositionSchema,
});

export const ProfessorQueryParams = t.Object({
  ...CommonQueryParams,
  academicPosition: t.Optional(
    t.Boolean({
      default: false,
      examples: [true, false],
      description: "Include academic position details",
    }),
  ),
});

export type Professor = Static<typeof ProfessorSchema>;
export type CreateProfessorDTO = Static<typeof CreateProfrssorDTO>;
export type ProfessorDTO = Static<typeof ProfessorDTO>;
export type ProfessorQueryParams = Static<typeof ProfessorQueryParams>;
