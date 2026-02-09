import { excuteSeedRoles } from "./role";
import { prisma } from "../../src/lib/db";
import { executeSeedTags } from "./tag";
import { excuteSeedTypeCourses } from "./type-course";

async function main() {
  await excuteSeedRoles(prisma);
  await executeSeedTags(prisma);
  await excuteSeedTypeCourses(prisma);
}

try {
  await main();
  console.log("Seeding completed.");
} catch (e) {
  console.error("Seeding failed:", e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
