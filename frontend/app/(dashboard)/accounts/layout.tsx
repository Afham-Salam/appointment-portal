import { requireAdmin } from "@/lib/actions/auth-guard";

export default async function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <>{children}</>;
}
