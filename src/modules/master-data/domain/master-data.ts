import { t, Static } from "elysia";
import { RoleSchema } from "../../../core/models/role";
import { TypeCourseSchema } from "../../../core/models/type-course";
import { Tag, TagGroup } from "../../../core/models/tag";

export const MasterData = t.Intersect([
  t.Object({
    roles: t.Array(RoleSchema),
    typeCourses: t.Array(TypeCourseSchema),
    tagsGroups: t.Array(TagGroup),
    tags: t.Array(Tag),
  }),
]);

export type MasterDataDTO = Static<typeof MasterData>;
