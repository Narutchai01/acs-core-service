import { t, Static } from "elysia";

export const Tag = t.Object({
  id: t.Number(),
  name: t.String(),
  tagsGroupsId: t.Number(),
});

export type Tag = Static<typeof Tag>;

export const TagGroup = t.Object({
  id: t.Number(),
  name: t.String(),
  tags: t.Array(Tag),
});

export type TagGroup = Static<typeof TagGroup>;
