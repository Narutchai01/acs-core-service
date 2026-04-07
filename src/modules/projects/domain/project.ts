import { t, Static } from "elysia";
import { BaseModelSchema, CommonQueryParams} from "../../../core/models";
import { Tag } from "../../../core/models/tag";
import { UserSchema } from "../../users/domain/user";
import { CourseSchema, CourseDTO as CourseDTOSchema } from "../../courses/domain/course";
import { RoleSchema } from "../../../core/models/role";

export const CommonProjectFields = {
  title: t.String(),
  details: t.String(),
  githubURL: t.String(),
  presentationURL: t.Optional(t.String()),
  documentURL: t.Optional(t.String()),
  figmaURL: t.Optional(t.String()),
  youtubeURL: t.Optional(t.String()),
};

export const ProjectSchema = t.Intersect([
  t.Object({
    id: t.Number(),
    ...CommonProjectFields,
    thumbnailURL: t.String(),
    assetsURL: t.Optional(t.String()),
    techStacks: t.String(),
    projectTags: t.Optional(t.Array(Tag)),
    projectMembers: t.Optional(t.Array(UserSchema)),
    projectCourses: t.Optional(t.Array(CourseSchema)),
  }),
  BaseModelSchema,
]);

const ProjectMemberFields = {
  userID: t.Numeric(),
  roleID: t.Numeric(),
};

export const CreateProjectDTO = t.Object({
  thumbnailFile: t.File(),
  ...CommonProjectFields,
  tagsID: t.Array(t.Number()),
  members: t.Array(t.Object(t.Number())),
  coursesID: t.Array(t.Number()),
  assets: t.Files(),
  techStacks: t.Array(t.String()),
});

export const ProjectDTO = t.Intersect([
  t.Object({
    id: t.Number(),
    thumbnailURL: t.String(),
    ...CommonProjectFields,
    assetsURL: t.Array(t.String()),
    techStacks: t.Array(t.String()),
    tag: t.Array(Tag),

    member: t.Array(
      t.Intersect([
        UserSchema,
        t.Object({
          role: RoleSchema,
        })
      ])
    ),

    course: t.Array(CourseDTOSchema),
  })
]);

export const ProjectQueryParams = t.Object({
  tagID: t.Optional(t.Array(t.Numeric())),
  courseID: t.Optional(t.Array(t.Numeric())),
  ...CommonQueryParams,
  search: t.Optional(t.String()),
  searchBy: t.Optional(t.String()),
})

export const UpdateProjectDTO = t.Object({
  thumbnailFile: t.Optional(t.File()),
  ...Object.fromEntries(
    Object.entries(CommonProjectFields).map(([key, value]) => [
      key,
      t.Optional(value),
    ])
  ),
  newtagsID: t.Optional(t.Array(t.Number())),
  deletedtagsID: t.Optional(t.Array(t.Number())),
  newMembersID: t.Optional(t.Array(t.Object(ProjectMemberFields))),
  deletedmembersID: t.Optional(t.Array(t.Numeric())),
  newCoursesID: t.Optional(t.Array(t.Number())),
  deletedCoursesID: t.Optional(t.Array(t.Number())),
  assets: t.Optional(t.Files()),
  techStacks: t.Optional(t.Array(t.String())),
});

export type Project = Static<typeof ProjectSchema>;
export type CreateProjectDTO = Static<typeof CreateProjectDTO>;
export type UpdateProjectDTO = Static<typeof UpdateProjectDTO>;
export type ProjectDTO = Static<typeof ProjectDTO>;
export type ProjectQueryParams = Static<typeof ProjectQueryParams>;