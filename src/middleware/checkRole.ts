import { Elysia } from "elysia";
import { authMiddleware } from "./auth";
import { HttpStatusCode } from "../core/types/http";

export const roleMacro = new Elysia().use(authMiddleware).macro({
  checkRole(requireRoles: string[]) {
    return {
      beforeHandle({ roles, set }) {
        if (
          !roles ||
          !(
            Array.isArray(roles) &&
            roles
              .filter((role): role is string => typeof role === "string")
              .some((role) => requireRoles.includes(role))
          )
        ) {
          set.status = HttpStatusCode.FORBIDDEN;
          return {
            status: HttpStatusCode.FORBIDDEN,
            data: null,
            msg: "Forbidden: Insufficient role",
            err: "FORBIDDEN",
          };
        }
      },
    };
  },
});

console.log();
