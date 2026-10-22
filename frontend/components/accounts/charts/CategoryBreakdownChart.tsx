"use client";
import { Pie } from "@ant-design/charts";
import { Empty } from "antd";
import { money } from "@/lib/accounts/formatters";

export default function CategoryBreakdownChart({ data }: { data: { category: string; amount: number }[] }) {
  if (!data.some(row => row.amount > 0)) return <div className="flex h-[300px] items-center justify-center"><Empty description="No transactions in this period" /></div>;
  return <Pie height={300} data={data.filter(row => row.amount > 0).map(row => ({ ...row, amount: row.amount / 100 }))} angleField="amount" colorField="category" innerRadius={0.65} scale={{ color: { range: ["#2D5A3F", "#b57b42", "#537b72", "#d6bd83", "#91a58c", "#80694b"] } }} legend={{ color: { position: "bottom" } }} tooltip={{ items: [{ field: "amount", name: "Amount", valueFormatter: (value: number) => money(value * 100) }] }} />;
}
