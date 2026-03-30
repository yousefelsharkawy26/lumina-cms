import { prisma } from "./src/lib/prisma";

async function main() {
  try {
    const res = await prisma.storeSettings.upsert({
      where: { id: "default" },
      update: {
        theme: "system"
      },
      create: {
        id: "default",
        theme: "system"
      }
    });
    console.log("Success", res);
  } catch (err: any) {
    console.error("Prisma Error:", err.message);
  }
}

main().finally(() => prisma.$disconnect());
