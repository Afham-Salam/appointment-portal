import { requireAdmin } from "@/lib/actions/auth-guard";
import AccountsClient from "./AccountsClient";

export default async function AccountsPage() {
  await requireAdmin();
  return <AccountsClient />;
}
