import { Static, t } from "elysia";

export const RoleSchema = t.Object({
  id: t.Number(),
  name: t.String(),
});

export type Role = Static<typeof RoleSchema>;
