"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Application = {
  id: string;
  company: string;
  position: string;
  status: string;
  jobUrl: string;
  appliedAt: string;
  deadline: string;
  notes: string;
};

export default function EditApplicationForm({
  application,
}: {
  application: Application;
}) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const data = {
      company: formData.get("company"),
      position: formData.get("position"),
      status: formData.get("status"),
      jobUrl: formData.get("jobUrl"),
      appliedAt: formData.get("appliedAt"),
      deadline: formData.get("deadline"),
      notes: formData.get("notes"),
    };

    try {
      const response = await fetch(
        `/api/applications/${application.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const result = await response.json();

        throw new Error(
          result.error || "Failed to update application.",
        );
      }

      router.push(`/applications/${application.id}`);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 text-gray-900 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            href={`/applications/${application.id}`}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ← Back to application
          </Link>

          <h1 className="mt-4 text-3xl font-bold">
            Edit Application
          </h1>

          <p className="mt-2 text-gray-500">
            Update your job or internship application.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label
              htmlFor="company"
              className="mb-2 block text-sm font-medium"
            >
              Company *
            </label>

            <input
              id="company"
              name="company"
              type="text"
              required
              defaultValue={application.company}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 outline-none transition focus:border-gray-900 focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="position"
              className="mb-2 block text-sm font-medium"
            >
              Position *
            </label>

            <input
              id="position"
              name="position"
              type="text"
              required
              defaultValue={application.position}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 outline-none transition focus:border-gray-900 focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue={application.status}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 outline-none transition focus:border-gray-900 focus:bg-white"
            >
              <option value="SAVED">Saved</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="jobUrl"
              className="mb-2 block text-sm font-medium"
            >
              Job URL
            </label>

            <input
              id="jobUrl"
              name="jobUrl"
              type="url"
              defaultValue={application.jobUrl}
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 outline-none transition focus:border-gray-900 focus:bg-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="appliedAt"
                className="mb-2 block text-sm font-medium"
              >
                Application Date
              </label>

              <input
                id="appliedAt"
                name="appliedAt"
                type="date"
                defaultValue={application.appliedAt}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 outline-none transition focus:border-gray-900 focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="deadline"
                className="mb-2 block text-sm font-medium"
              >
                Deadline
              </label>

              <input
                id="deadline"
                name="deadline"
                type="date"
                defaultValue={application.deadline}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 outline-none transition focus:border-gray-900 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="mb-2 block text-sm font-medium"
            >
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              rows={5}
              defaultValue={application.notes}
              className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 outline-none transition focus:border-gray-900 focus:bg-white"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href={`/applications/${application.id}`}
             className="rounded-lg border border-gray-300 px-5 py-3 text-center text-sm font-medium transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}