import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { ApplicationStatus } from "../generated/prisma/enums";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const SEED_USER_ID = "careertrack-seed-user";

async function main() {
  const seedUser = await prisma.user.upsert({
    where: {
      email: "seed@careertrack.local",
    },
    update: {},
    create: {
      id: SEED_USER_ID,
      name: "CareerTrack Demo",
      email: "seed@careertrack.local",
      emailVerified: true,
    },
  });

  await prisma.application.deleteMany({
    where: {
      userId: seedUser.id,
    },
  });

  await prisma.application.create({
    data: {
      company: "Booking.com",
      position: "Software Engineering Intern",
      status: ApplicationStatus.APPLIED,
      notes: "Demo application",
      userId: seedUser.id,
    },
  });

  await prisma.application.create({
    data: {
      company: "Spotify",
      position: "Frontend Engineering Intern",
      status: ApplicationStatus.INTERVIEW,
      notes: "Demo interview",
      userId: seedUser.id,
    },
  });

  await prisma.application.create({
    data: {
      company: "Microsoft",
      position: "Software Engineering Intern",
      status: ApplicationStatus.SAVED,
      userId: seedUser.id,
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