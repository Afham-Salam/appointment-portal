import { requireAdmin } from "@/lib/actions/auth-guard";
import LettersClient from "./LettersClient";

export default async function LettersPage() {
  await requireAdmin();
  return <LettersClient />;
}
