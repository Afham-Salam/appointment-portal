export type TransactionType = "income" | "expense";
export type TransactionInput = {
  type: TransactionType;
  date: string;
  amount: number;
  category: string;
  source: "client" | "other";
  client_id: string | null;
  payee: string;
  payment_method: string;
  reference: string;
  notes: string;
};
export type Transaction = Omit<TransactionInput, "amount"> & {
  id: string;
  amount_paise: number;
  status: "active" | "void";
  created_at: string;
  updated_at: string;
  created_by: string;
  version: number;
};
export type AuditEntry = {
  id: number;
  action: string;
  actor: string;
  occurred_at: string;
  before_data: Transaction | null;
  after_data: Transaction;
};
export type ClientOption = { id: string; name: string; phone: string };
