import { requireAdmin } from "@/lib/actions/auth-guard";

export default async function StudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <>{children}</>;
}
