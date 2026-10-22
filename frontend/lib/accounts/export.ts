import type { Transaction } from "./types";
import { monthlyReport, summarize } from "./formatters";

export async function exportFinance(rows: Transaction[], reportRows: Transaction[], from: string, to: string, grouping: "Daily" | "Monthly" = "Monthly") {
  const XLSX = await import("xlsx");
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, XLSX.utils.json_to_sheet(rows.map(row => ({
    ID: row.id, Date: row.date, Type: row.type, "Client / payee": row.payee, Category: row.category,
    Source: row.source, "Amount (INR)": row.amount_paise / 100, Method: row.payment_method,
    Reference: row.reference, Notes: row.notes, Status: row.status,
  }))), "Filtered transactions");
  const report = monthlyReport(reportRows, from, to, grouping);
  const totals = summarize(reportRows);
  XLSX.utils.book_append_sheet(book, XLSX.utils.json_to_sheet([...report, { month: "Period total", ...totals }].map(row => ({
    Period: row.month, "Income (INR)": row.income / 100, "Expenses (INR)": row.expense / 100,
    "Net income (INR)": row.net / 100, "Client income (INR)": row.client / 100, "Other income (INR)": row.other / 100,
  }))), "Period report");
  XLSX.writeFile(book, `clinic-accounts-${from}-to-${to}.xlsx`);
}
