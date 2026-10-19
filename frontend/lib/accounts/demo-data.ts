import type { AuditEntry, ClientOption, Transaction } from "./types";

export const demoClients: ClientOption[] = [
  { id: "demo-client-1", name: "Ananya Menon", phone: "Demo client 01" },
  { id: "demo-client-2", name: "Arjun Nair", phone: "Demo client 02" },
  { id: "demo-client-3", name: "Meera Shah", phone: "Demo client 03" },
  { id: "demo-client-4", name: "Rohan Das", phone: "Demo client 04" },
];

// Synthetic records only. Build dates relative to the selected demo year.
export function createDemoTransactions(year: number): Transaction[] {
  const rows: Transaction[] = [];
  for (let y = year - 1; y <= year; y++) {
    for (let month = 1; month <= 12; month++) {
      const templates = [
        { type: "income", category: "Consultation fees", payee: demoClients[0].name, amount: 4500 + month * 100, source: "client", client_id: demoClients[0].id },
        { type: "income", category: "Therapy fees", payee: demoClients[1].name, amount: 12500 + month * 300, source: "client", client_id: demoClients[1].id },
        { type: "expense", category: "Rent", payee: "Clinic premises", amount: 15000, source: "other", client_id: null },
        { type: "income", category: "Assessment fees", payee: demoClients[2].name, amount: 8500 + month * 200, source: "client", client_id: demoClients[2].id },
        { type: "expense", category: "Salaries", payee: "Clinic team", amount: 18000 + month * 100, source: "other", client_id: null },
        { type: "income", category: "Other income", payee: "Wellness workshop", amount: 18000 + month * 400, source: "other", client_id: null },
        { type: "expense", category: "Utilities", payee: "Electricity & internet", amount: 2200 + month * 40, source: "other", client_id: null },
        { type: "income", category: "Therapy fees", payee: demoClients[3].name, amount: 9500 + month * 150, source: "client", client_id: demoClients[3].id },
        { type: "expense", category: "Supplies", payee: "Care supplies", amount: 1800 + month * 80, source: "other", client_id: null },
        { type: "expense", category: "Maintenance", payee: "Facility services", amount: 1200 + month * 50, source: "other", client_id: null },
      ] as const;
      templates.forEach((template, index) => {
        const date = `${y}-${String(month).padStart(2, "0")}-${String(index * 2 + 1).padStart(2, "0")}`;
        const { amount, ...fields } = template;
        rows.push({ ...fields, id: `demo-${y}-${month}-${index}`, date,
          amount_paise: Math.round(amount * (y < year ? 0.9 : 1) * 100),
          payment_method: ["UPI", "Bank transfer", "Cash", "Card"][index % 4],
          reference: `DEMO-${y}${String(month).padStart(2, "0")}-${index + 1}`,
          notes: "Sample transaction for preview purposes.", status: month === 2 && index === 9 ? "void" : "active",
          created_by: "Demo administrator", created_at: `${date}T09:00:00.000Z`, updated_at: `${date}T09:00:00.000Z`, version: 1,
        });
      });
    }
  }
  return rows;
}

export function initialAudit(transaction: Transaction): AuditEntry {
  return { id: 0, action: "Created", actor: "Demo administrator", occurred_at: transaction.created_at, before_data: null, after_data: transaction };
}
