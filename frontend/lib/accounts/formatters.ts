import type { Transaction } from "./types";

export const money = (paise: number) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 2,
}).format(paise / 100);

export function summarize(rows: Transaction[]) {
  let income = 0, expense = 0, client = 0;
  for (const row of rows) {
    if (row.status === "void") continue;
    if (row.type === "income") {
      income += row.amount_paise;
      if (row.source === "client") client += row.amount_paise;
    } else expense += row.amount_paise;
  }
  return { income, expense, net: income - expense, client, other: income - client };
}

export function monthlyReport(rows: Transaction[], from: string, to: string, grouping: "Daily" | "Monthly" = "Monthly") {
  const result = [];
  if (grouping === "Daily") {
    const date = new Date(`${from}T00:00:00Z`);
    while (date.toISOString().slice(0, 10) <= to) {
      const day = date.toISOString().slice(0, 10);
      result.push({ month: day, ...summarize(rows.filter(row => row.date === day)) });
      date.setUTCDate(date.getUTCDate() + 1);
    }
    return result;
  }
  let month = from.slice(0, 7);
  while (month <= to.slice(0, 7)) {
    result.push({ month, ...summarize(rows.filter(row => row.date.startsWith(month))) });
    const [year, number] = month.split("-").map(Number);
    month = number === 12 ? `${year + 1}-01` : `${year}-${String(number + 1).padStart(2, "0")}`;
  }
  return result;
}
