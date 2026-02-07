import { Role } from "../../src/modules/roles/domain/role.js";
import { PrismaClient } from "../../src/generated/prisma/client.js";

export const roles: Role[] = [
  {
    id: 1,
    name: "admin",
  },
  {
    id: 2,
    name: "student",
  },
  {
    id: 3,
    name: "professor",
  },
];

export const excuteSeedRoles = async (prisma: PrismaClient) => {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: {
        id: role.id,
        name: role.name,
      },
    });
  }
};
