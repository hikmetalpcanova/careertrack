import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditApplicationForm from "./EditApplicationForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

const session = await auth.api.getSession({
  headers: await headers(),
});

if (!session) {
  redirect("/sign-in");
}

const application = await prisma.application.findFirst({
  where: {
    id,
    userId: session.user.id,
  },
});

  if (!application) {
    notFound();
  }

  return (
    <EditApplicationForm
      application={{
        id: application.id,
        company: application.company,
        position: application.position,
        status: application.status,
        jobUrl: application.jobUrl ?? "",
        appliedAt: application.appliedAt
          ? application.appliedAt.toISOString().slice(0, 10)
          : "",
        deadline: application.deadline
          ? application.deadline.toISOString().slice(0, 10)
          : "",
        notes: application.notes ?? "",
      }}
    />
  );
}