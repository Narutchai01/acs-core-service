import { excuteSeedRoles } from "./role";
import { prisma } from "../../src/lib/db";

async function main() {
  await excuteSeedRoles(prisma);
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
