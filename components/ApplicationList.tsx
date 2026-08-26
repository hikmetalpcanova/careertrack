"use client";

import {
  StatusBadge,
  formatStatus,
} from "@/components/StatusBadge";

import Link from "next/link";
import { useState } from "react";

type Application = {
  id: string;
  company: string;
  position: string;
  status: string;
  date: string;
};

const statuses = [
  "ALL",
  "SAVED",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];

export default function ApplicationList({
  applications,
}: {
  applications: Application[];
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filteredApplications = applications.filter((application) => {
    const searchTerm = search.toLowerCase().trim();

    const matchesSearch =
      application.company.toLowerCase().includes(searchTerm) ||
      application.position.toLowerCase().includes(searchTerm);

    const matchesStatus =
      status === "ALL" || application.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold">Applications</h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search company or position..."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:bg-white sm:w-72"
            />

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:bg-white"
            >
              {statuses.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {formatStatus(statusOption)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="p-10 text-center">
          <p className="font-medium">
            {applications.length === 0
              ? "No applications yet."
              : "No applications match your search."}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {applications.length === 0
              ? "Add your first job or internship application."
              : "Try changing your search or status filter."}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filteredApplications.map((application) => (
            <Link
              key={application.id}
              href={`/applications/${application.id}`}
              className="group flex flex-col gap-3 p-5 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
              <div>
                <h3 className="font-semibold transition-colors group-hover:text-black">
                  {application.company}
                </h3>

                <p className="text-sm text-gray-500">
                  {application.position}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 sm:gap-5">
  <div className="sm:text-right">
    <StatusBadge status={application.status} />

    <p className="mt-1.5 text-sm text-gray-400">
      {application.date}
    </p>
  </div>

  <span
    aria-hidden="true"
    className="hidden text-lg text-gray-300 transition group-hover:translate-x-1 group-hover:text-gray-500 sm:block"
  >
    →
  </span>
</div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

