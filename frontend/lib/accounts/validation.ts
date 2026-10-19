import { categories, paymentMethods } from "./constants";
import type { TransactionInput } from "./types";

export function validDate(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
}

export function validateTransaction(value: TransactionInput) {
  if (!value || !["income", "expense"].includes(value.type)) return "Choose income or expense.";
  if (typeof value.date !== "string" || !validDate(value.date)) return "Enter a valid payment date.";
  if (!Number.isFinite(value.amount) || value.amount <= 0 || value.amount > 100000000 || Math.abs(value.amount * 100 - Math.round(value.amount * 100)) > 0.00001) return "Enter an amount between ₹0.01 and ₹10,00,00,000 with at most two decimal places.";
  if (!categories[value.type].includes(value.category)) return "Choose a valid category.";
  if (!["client", "other"].includes(value.source)) return "Choose a valid income source.";
  if (!paymentMethods.includes(value.payment_method)) return "Choose a valid payment method.";
  for (const key of ["payee", "reference", "notes"] as const) {
    if (typeof value[key] !== "string" || value[key].length > (key === "notes" ? 2000 : 200)) return `Invalid ${key}.`;
  }
  if (!value.payee.trim()) return "Enter a payer or payee name.";
  return null;
}
