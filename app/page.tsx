import { requireSession } from "@/lib/require-session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import ApplicationList from "@/components/ApplicationList";
import SignOutButton from "@/components/SignOutButton";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await requireSession();

  const applications = await prisma.application.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 text-gray-900 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
       <header className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
        Application Tracker
      </p>

      <h1 className="text-3xl font-bold tracking-tight">
        CareerTrack
      </h1>

      <p className="mt-2 text-gray-500">
        Track your job and internship applications.
      </p>

      <p className="mt-3 text-sm text-gray-400">
        Signed in as{" "}
        <span className="font-medium text-gray-600">
          {session.user.name}
        </span>
      </p>
    </div>

    <div className="flex w-full gap-3 sm:w-auto">
      <SignOutButton />

      <Link
        href="/applications/new"
        className="flex-1 rounded-lg bg-black px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-gray-800 sm:flex-none"
      >
        + Add Application
      </Link>
    </div>
  </div>
</header>

        <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
        {value}
      </p>
    </div>
  );
}