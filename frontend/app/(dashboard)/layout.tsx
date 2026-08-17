// app/(dashboard)/layout.tsx
import { getCurrentUser } from "@/lib/actions/user";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <DashboardShell role={user.role as "admin" | "staff"}>
      {children}
    </DashboardShell>
  );
}