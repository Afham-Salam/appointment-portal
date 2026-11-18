export const categories = {
  income: ["Consultation fees", "Tuition fee", "Assessment fees", "Other income"],
  expense: ["Rent", "Salaries", "Utilities", "Electricity", "Maintenance", "Home", "Personal", "Other expenses"],
};
export const categoryLabels: Record<string, string> = {
  Utilities: "Office Utilities",
  Maintenance: "Office Maintenance",
};
export const categoryLabel = (category: string) => categoryLabels[category] || category;
export const paymentMethods = ["Cash", "UPI", "Bank transfer", "Card", "Cheque"];
export const financeColors = { income: "#2D5A3F", expense: "#b57b42", net: "#537b72" };
