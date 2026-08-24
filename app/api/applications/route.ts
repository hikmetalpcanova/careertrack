import prisma from "@/lib/prisma";
import { ApplicationStatus } from "@/generated/prisma/enums";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { parseApplicationInput } from "@/lib/application-input";

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

    const parsed = parseApplicationInput(body, {
      defaultStatus: ApplicationStatus.SAVED,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error },
        { status: 400 },
      );
    }

    const application = await prisma.application.create({
      data: {
        ...parsed.data,
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