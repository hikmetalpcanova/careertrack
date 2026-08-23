import prisma from "@/lib/prisma";
import Link from "next/link";
import ApplicationList from "@/components/ApplicationList";

export const dynamic = "force-dynamic";

export default async function Home() {
  const applications = await prisma.application.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="mx-auto max-w-6xl">
       <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">CareerTrack</h1>
            <p className="mt-1 text-gray-500">
              Track your job and internship applications.
            </p>
          </div>

          <Link
  href="/applications/new"
 className="w-full rounded-lg bg-black px-5 py-3 text-center text-sm font-medium text-white sm:w-auto"
>
  + Add Application
</Link>
        </header>

        <section className="mb-10 grid gap-4 md:grid-cols-4">
          <StatCard
  title="Total Applications"
  value={applications.length.toString()}
/>

<StatCard
  title="Applied"
  value={applications
    .filter((application) => application.status === "APPLIED")
    .length.toString()}
/>

<StatCard
  title="Interviews"
  value={applications
    .filter((application) => application.status === "INTERVIEW")
    .length.toString()}
/>

<StatCard
  title="Offers"
  value={applications
    .filter((application) => application.status === "OFFER")
    .length.toString()}
/>
        </section>

        <ApplicationList
  applications={applications.map((application) => ({
    id: application.id,
    company: application.company,
    position: application.position,
    status: application.status,
    date: (
      application.appliedAt ?? application.createdAt
    ).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  }))}
/>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}