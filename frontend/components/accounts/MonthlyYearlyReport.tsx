import { Table } from "antd";
import { money, monthlyReport } from "@/lib/accounts/formatters";

export default function MonthlyYearlyReport({ rows, grouping = "Monthly" }: { rows: ReturnType<typeof monthlyReport>; grouping?: "Daily" | "Monthly" }) {
  return <Table rowKey="month" size="small" pagination={false} scroll={{ x: 550 }} dataSource={rows} columns={[
    { title: grouping === "Daily" ? "Date" : "Month", dataIndex: "month" },
    { title: "Income", dataIndex: "income", render: money },
    { title: "Expenses", dataIndex: "expense", render: money },
    { title: "Net income", dataIndex: "net", render: money },
    { title: "Client income", dataIndex: "client", render: money },
    { title: "Other income", dataIndex: "other", render: money },
  ]} summary={data => <Table.Summary.Row><Table.Summary.Cell index={0}><strong>Period total</strong></Table.Summary.Cell>{(["income", "expense", "net", "client", "other"] as const).map((key, index) => <Table.Summary.Cell key={key} index={index + 1}><strong>{money(data.reduce((sum, row) => sum + row[key], 0))}</strong></Table.Summary.Cell>)}</Table.Summary.Row>} />;
}
