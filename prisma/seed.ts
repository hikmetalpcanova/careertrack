import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { ApplicationStatus } from "../generated/prisma/enums";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.application.deleteMany();

  await prisma.application.create({
    data: {
      company: "Booking.com",
      position: "Software Engineering Intern",
      status: ApplicationStatus.APPLIED,
      notes: "First test application",
    },
  });

  await prisma.application.create({
    data: {
      company: "Spotify",
      position: "Frontend Engineering Intern",
      status: ApplicationStatus.INTERVIEW,
      notes: "First interview test",
    },
  });

  await prisma.application.create({
    data: {
      company: "Microsoft",
      position: "Software Engineering Intern",
      status: ApplicationStatus.SAVED,
    },
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });