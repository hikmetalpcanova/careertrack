import prisma from "@/lib/prisma";
import { ApplicationStatus } from "@/generated/prisma/enums";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const validStatuses = new Set<string>(Object.values(ApplicationStatus));

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
  headers: request.headers,
});

if (!session) {
  return NextResponse.json(
    { error: "Unauthorized." },
    { status: 401 },
  );
}
    const body = await request.json();

    const {
      company,
      position,
      status,
      jobUrl,
      appliedAt,
      deadline,
      notes,
    } = body;

    if (
      typeof company !== "string" ||
      !company.trim() ||
      typeof position !== "string" ||
      !position.trim()
    ) {
      return NextResponse.json(
        { error: "Company and position are required." },
        { status: 400 },
      );
    }

    const normalizedStatus =
      typeof status === "string" && status ? status : "SAVED";

    if (!validStatuses.has(normalizedStatus)) {
      return NextResponse.json(
        { error: "Invalid application status." },
        { status: 400 },
      );
    }

    let normalizedJobUrl: string | null = null;

    if (typeof jobUrl === "string" && jobUrl.trim()) {
      try {
        const url = new URL(jobUrl.trim());

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }

        normalizedJobUrl = url.toString();
      } catch {
        return NextResponse.json(
          { error: "Job URL must be a valid HTTP or HTTPS URL." },
          { status: 400 },
        );
      }
    }

    const parsedAppliedAt =
      typeof appliedAt === "string" && appliedAt
        ? new Date(appliedAt)
        : null;

    const parsedDeadline =
      typeof deadline === "string" && deadline
        ? new Date(deadline)
        : null;

    if (
      (parsedAppliedAt && Number.isNaN(parsedAppliedAt.getTime())) ||
      (parsedDeadline && Number.isNaN(parsedDeadline.getTime()))
    ) {
      return NextResponse.json(
        { error: "Invalid date." },
        { status: 400 },
      );
    }

    const application = await prisma.application.create({
      data: {
        company: company.trim(),
        position: position.trim(),
        status: normalizedStatus as ApplicationStatus,
        jobUrl: normalizedJobUrl,
        appliedAt: parsedAppliedAt,
        deadline: parsedDeadline,
        notes:
          typeof notes === "string" && notes.trim()
            ? notes.trim()
            : null,

            userId: session.user.id,
      },
    });

    return NextResponse.json(application, {
      status: 201,
    });
  } catch (error) {
    console.error("Failed to create application:", error);

    return NextResponse.json(
      { error: "Failed to create application." },
      { status: 500 },
    );
  }
}