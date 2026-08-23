export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SAVED: "bg-gray-100 text-gray-700",
    APPLIED: "bg-blue-50 text-blue-700",
    INTERVIEW: "bg-amber-50 text-amber-700",
    OFFER: "bg-green-50 text-green-700",
    REJECTED: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}

export function formatStatus(status: string) {
  if (status === "ALL") {
    return "All statuses";
  }

  return status.charAt(0) + status.slice(1).toLowerCase();
}