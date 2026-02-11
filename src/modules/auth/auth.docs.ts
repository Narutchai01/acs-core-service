import { CreateCredentialsDTO } from "./domain/auth";

export const authDocs = {
  createCredentials: {
    detail: {
      description: "Create credentials for a user to reset their password",
      summary: "Create credentials for password reset",
      tags: ["Auth"],
    },
    body: CreateCredentialsDTO,
  },
};
