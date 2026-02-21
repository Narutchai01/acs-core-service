import { t, Static } from "elysia";
import { BaseModelSchema } from "../../../core/models";

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
  members: t.Array(t.Object(ProjectMemberFields)),
});

export const ProjectDTO = t.Intersect([
  t.Object({
    id: t.Number(),
    thumbnailURL: t.String(),
    ...CommonProjectFields,
  }),
]);

export type Project = Static<typeof ProjectSchema>;
export type CreateProjectDTO = Static<typeof CreateProjectDTO>;
export type ProjectDTO = Static<typeof ProjectDTO>;
