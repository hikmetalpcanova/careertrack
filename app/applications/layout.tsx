import { requireSession } from "@/lib/require-session";

export default async function ApplicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();

  return children;
}