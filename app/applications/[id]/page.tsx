import { StatusBadge } from "@/components/StatusBadge";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteApplicationButton from "./DeleteApplicationButton";
import { requireSession } from "@/lib/require-session";

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
const session = await requireSession();
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
    <main className="min-h-screen bg-gray-50 px-4 py-6 text-gray-900 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
         <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
  <div className="min-w-0">
    <div className="mb-3">
      <StatusBadge status={application.status} />
    </div>

    <h1 className="wrap-break-word text-3xl font-bold tracking-tight">
      {application.company}
    </h1>

    <p className="mt-2 text-lg text-gray-500">
      {application.position}
    </p>
  </div>

  <div className="flex flex-wrap gap-3">
    <Link
      href={`/applications/${application.id}/edit`}
      className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
    >
      Edit Application
    </Link>

    <DeleteApplicationButton
      applicationId={application.id}
      company={application.company}
    />
  </div>
</div>

          <div className="grid gap-x-8 gap-y-6 border-t border-gray-200 pt-6 sm:grid-cols-2">
            <DetailItem
              label="Application Date"
              value={
                application.appliedAt
                  ? application.appliedAt.toLocaleDateString("en-GB")
                  : "Not set"
              }
            />

            <DetailItem
              label="Deadline"
              value={
                application.deadline
                  ? application.deadline.toLocaleDateString("en-GB")
                  : "Not set"
              }
            />

            <DetailItem
              label="Created"
              value={application.createdAt.toLocaleDateString("en-GB")}
            />

            <DetailItem
              label="Last Updated"
              value={application.updatedAt.toLocaleDateString("en-GB")}
            />
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
  Job URL
</p>

            {application.jobUrl ? (
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium underline"
              >
                Open job posting
              </a>
            ) : (
              <p className="mt-2 text-sm">Not set</p>
            )}
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
  Notes
</p>

            <p className="mt-2 whitespace-pre-wrap">
              {application.notes || "No notes added."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-2 font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}
