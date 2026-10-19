"use client";
import { Button, Popconfirm, Space, Tag } from "antd";
import { DataTable, type Column } from "@/components/DataTable";
import { money } from "@/lib/accounts/formatters";
import type { Transaction } from "@/lib/accounts/types";

export default function TransactionHistoryTable({ rows, busy, onEdit, onView, onVoid }: {
  rows: Transaction[]; busy: boolean; onEdit: (row: Transaction) => void;
  onView: (row: Transaction) => void; onVoid: (row: Transaction) => Promise<void>;
}) {
  const columns: Column<Transaction>[] = [
    { key: "date", title: "Payment date" },
    { key: "type", title: "Type", render: row => <Tag color={row.type === "income" ? "green" : "gold"}>{row.type}</Tag> },
    { key: "payee", title: "Client / payee" },
    { key: "category", title: "Category" },
    { key: "amount_paise", title: "Amount", render: row => <span className={row.status === "void" ? "line-through text-gray-400" : "font-semibold"}>{money(row.amount_paise)}</span> },
    { key: "payment_method", title: "Method" },
    { key: "reference", title: "Reference" },
    { key: "status", title: "Status", render: row => <Tag>{row.status}</Tag> },
    { key: "actions", title: "Actions", render: row => <Space>
      <Button size="small" onClick={() => onView(row)}>Details</Button>
      {row.status === "active" && <><Button size="small" disabled={busy} onClick={() => onEdit(row)}>Edit</Button>
        <Popconfirm title="Void this transaction?" description="It stays in history but is excluded from totals." onConfirm={() => onVoid(row)} okButtonProps={{ loading: busy }}><Button size="small" danger disabled={busy}>Void</Button></Popconfirm></>}
    </Space> },
  ];
  return <DataTable columns={columns} data={rows} pageSize={10} />;
}
