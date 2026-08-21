import prisma from "@/lib/prisma";
import { ApplicationStatus } from "@/generated/prisma/enums";
import { NextResponse } from "next/server";

const validStatuses = new Set<string>(Object.values(ApplicationStatus));

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingApplication = await prisma.application.findUnique({
      where: { id },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 },
      );
    }

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

    if (
      typeof status !== "string" ||
      !validStatuses.has(status)
    ) {
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

    const application = await prisma.application.update({
      where: { id },
      data: {
        company: company.trim(),
        position: position.trim(),
        status: status as ApplicationStatus,
        jobUrl: normalizedJobUrl,
        appliedAt: parsedAppliedAt,
        deadline: parsedDeadline,
        notes:
          typeof notes === "string" && notes.trim()
            ? notes.trim()
            : null,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Failed to update application:", error);

    return NextResponse.json(
      { error: "Failed to update application." },
      { status: 500 },
    );
  }
}
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existingApplication = await prisma.application.findUnique({
      where: { id },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 },
      );
    }

    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Application deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete application:", error);

    return NextResponse.json(
      { error: "Failed to delete application." },
      { status: 500 },
    );
  }
}