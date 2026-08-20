const applications = [
  {
    company: "Booking.com",
    position: "Software Engineering Intern",
    status: "Applied",
    date: "18 Aug 2026",
  },
  {
    company: "Spotify",
    position: "Frontend Engineering Intern",
    status: "Interview",
    date: "15 Aug 2026",
  },
  {
    company: "Microsoft",
    position: "Software Engineering Intern",
    status: "Saved",
    date: "12 Aug 2026",
  },
];

export default function Home() {
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
          <StatCard title="Total Applications" value="12" />
          <StatCard title="Applied" value="6" />
          <StatCard title="Interviews" value="3" />
          <StatCard title="Offers" value="1" />
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold">Applications</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {applications.map((application) => (
              <div
                key={application.company}
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
                  <p className="text-sm text-gray-400">{application.date}</p>
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