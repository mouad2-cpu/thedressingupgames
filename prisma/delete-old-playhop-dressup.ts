import { PrismaClient } from "@prisma/client";
import { PLAYHOP_DRESSUP_SLUGS } from "../src/lib/playhop-dressup-slugs";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.game.deleteMany({
    where: { slug: { in: [...PLAYHOP_DRESSUP_SLUGS] } },
  });
  console.log(`Deleted ${result.count} old Playhop dress-up games`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
