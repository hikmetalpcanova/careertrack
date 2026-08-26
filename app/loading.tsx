export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 text-gray-900">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div
          className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900"
          aria-hidden="true"
        />

        <p className="mt-5 font-semibold">
          Loading CareerTrack
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Just a moment...
        </p>
      </div>
    </main>
  );
}