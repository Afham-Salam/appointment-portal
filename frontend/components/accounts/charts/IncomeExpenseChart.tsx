"use client";
import { Column } from "@ant-design/charts";
import { financeColors } from "@/lib/accounts/constants";
import { money, monthlyReport } from "@/lib/accounts/formatters";

export default function IncomeExpenseChart({
  rows,
}: {
  rows: ReturnType<typeof monthlyReport>;
}) {
  return (
    <Column
      height={300}
      data={rows.flatMap((row) => [
        { month: row.month, type: "Income", amount: row.income / 100 },
        { month: row.month, type: "Expenses", amount: row.expense / 100 },
      ])}
      xField="month"
      yField="amount"
      colorField="type"
      group
      scale={{
        color: { range: [financeColors.income, financeColors.expense] },
      }}
      axis={{ y: { title: "INR (₹)" } }}
      tooltip={{
        items: [
          {
            channel: "y",
            valueFormatter: (value: number) => money(value * 100),
          },
        ],
      }}
    />
  );
}
