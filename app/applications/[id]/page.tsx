import { StatusBadge } from "@/components/StatusBadge";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteApplicationButton from "./DeleteApplicationButton";

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: {
      id,
    },
  });

  if (!application) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {application.company}
              </h1>

              <p className="mt-2 text-lg text-gray-500">
                {application.position}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
  <StatusBadge status={application.status} />

  <Link
    href={`/applications/${application.id}/edit`}
    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
  >
    Edit Application
  </Link>

  <DeleteApplicationButton
    applicationId={application.id}
    company={application.company}
  />
</div>
          </div>

          <div className="grid gap-6 border-t border-gray-200 pt-6 md:grid-cols-2">
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
            <p className="text-sm font-medium text-gray-500">
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
            <p className="text-sm font-medium text-gray-500">
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
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}