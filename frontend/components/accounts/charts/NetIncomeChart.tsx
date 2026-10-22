"use client";
import { Line } from "@ant-design/charts";
import { financeColors } from "@/lib/accounts/constants";
import { money, monthlyReport } from "@/lib/accounts/formatters";

export default function NetIncomeChart({ rows }: { rows: ReturnType<typeof monthlyReport> }) {
  return <Line height={300} data={rows.map(row => ({ month: row.month, net: row.net / 100 }))} xField="month" yField="net" point={{ shapeField: "circle", sizeField: 4 }} style={{ stroke: financeColors.net, lineWidth: 3 }} axis={{ y: { title: "INR (₹)" } }} tooltip={{ items: [{ channel: "y", valueFormatter: (value: number) => money(value * 100) }] }} />;
}
