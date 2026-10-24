import { requireAdmin } from "@/lib/actions/auth-guard";

export default async function LettersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <>{children}</>;
}
