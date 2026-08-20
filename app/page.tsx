import prisma from "@/lib/prisma";

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
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">CareerTrack</h1>
            <p className="mt-1 text-gray-500">
              Track your job and internship applications.
            </p>
          </div>

          <button className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white">
            + Add Application
          </button>
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

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold">Applications</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {applications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between p-6"
              >
                <div>
                  <h3 className="font-semibold">{application.company}</h3>
                  <p className="text-sm text-gray-500">
                    {application.position}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium">{application.status}</p>
                  <p className="text-sm text-gray-400">
  {application.createdAt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</p>
                </div>
              </div>
            ))}
          </div>
        </section>
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