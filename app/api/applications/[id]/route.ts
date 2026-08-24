import prisma from "@/lib/prisma";
import { parseApplicationInput } from "@/lib/application-input";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;
    const body = await request.json();

    const existingApplication = await prisma.application.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 },
      );
    }

    const parsed = parseApplicationInput(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error },
        { status: 400 },
      );
    }

    const application = await prisma.application.update({
      where: { id },
      data: parsed.data,
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
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    const existingApplication = await prisma.application.findFirst({
  where: {
    id,
    userId: session.user.id,
  },
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