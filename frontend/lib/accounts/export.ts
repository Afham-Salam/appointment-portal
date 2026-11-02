import type { Transaction } from "./types";
import { monthlyReport, summarize } from "./formatters";

// export async function exportFinance(rows: Transaction[], reportRows: Transaction[], from: string, to: string, grouping: "Daily" | "Monthly" = "Monthly") {
//   const XLSX = await import("xlsx");
//   const book = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(book, XLSX.utils.json_to_sheet(rows.map(row => ({
//     ID: row.id, Date: row.date, Type: row.type, "Client / payee": row.payee, Category: row.category,
//     Source: row.source, "Amount (INR)": row.amount_paise / 100, Method: row.payment_method,
//     Reference: row.reference, Notes: row.notes, Status: row.status,
//   }))), "Filtered transactions");
//   const report = monthlyReport(reportRows, from, to, grouping);
//   const totals = summarize(reportRows);
//   XLSX.utils.book_append_sheet(book, XLSX.utils.json_to_sheet([...report, { month: "Period total", ...totals }].map(row => ({
//     Period: row.month, "Income (INR)": row.income / 100, "Expenses (INR)": row.expense / 100,
//     "Net income (INR)": row.net / 100, "Client income (INR)": row.client / 100, "Other income (INR)": row.other / 100,
//   }))), "Period report");
//   XLSX.writeFile(book, `clinic-accounts-${from}-to-${to}.xlsx`);
// }

export async function exportFinance(rows: Transaction[], reportRows: Transaction[], from: string, to: string, grouping: "Daily" | "Monthly" = "Monthly") {
  const XLSX = await import("xlsx");
  const book = XLSX.utils.book_new();
  const totals = summarize(reportRows);

  // Sheet 1: Filtered transactions with header
  const headerRows = [
    { "": `Treasure Counseling Center — Accounts Export` },
    { "": `Date Range: ${from} to ${to}` },
    { "": `Total Income: ₹${(totals.income / 100).toLocaleString("en-IN")}  |  Total Expenses: ₹${(totals.expense / 100).toLocaleString("en-IN")}  |  Net Income: ₹${(totals.net / 100).toLocaleString("en-IN")}` },
    {},
  ];
  const txRows = rows.map(row => ({
    Date: row.date, Type: row.type, "Client / payee": row.payee, Category: row.category,
    Source: row.source, "Amount (INR)": row.amount_paise / 100, Method: row.payment_method,
    Reference: row.reference, Notes: row.notes, Status: row.status,
  }));
  const ws = XLSX.utils.json_to_sheet(headerRows, { skipHeader: true });
  XLSX.utils.sheet_add_json(ws, txRows, { origin: "A5" });
  XLSX.utils.book_append_sheet(book, ws, "Filtered transactions");

  // Sheet 2: Period report
  const report = monthlyReport(reportRows, from, to, grouping);
  const reportHeader = [
    { "": `${grouping} Financial Report` },
    { "": `Period: ${from} to ${to}` },
    {},
  ];
  const reportData = [...report, { month: "Period total", ...totals }].map(row => ({
    Period: row.month, "Income (INR)": row.income / 100, "Expenses (INR)": row.expense / 100,
    "Net income (INR)": row.net / 100, "Client income (INR)": row.client / 100, "Other income (INR)": row.other / 100,
  }));
  const ws2 = XLSX.utils.json_to_sheet(reportHeader, { skipHeader: true });
  XLSX.utils.sheet_add_json(ws2, reportData, { origin: "A4" });
  XLSX.utils.book_append_sheet(book, ws2, "Period report");

  XLSX.writeFile(book, `clinic-accounts-${from}-to-${to}.xlsx`);
}