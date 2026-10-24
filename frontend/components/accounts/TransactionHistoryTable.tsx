"use client";
import { useState } from "react";
import { Tag } from "antd";
import { DataTable, type Column } from "@/components/ui/DataTable";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { money } from "@/lib/accounts/formatters";
import type { Transaction } from "@/lib/accounts/types";

export default function TransactionHistoryTable({ rows, busy, onEdit, onView, onVoid }: {
  rows: Transaction[]; busy: boolean; onEdit: (row: Transaction) => void;
  onView: (row: Transaction) => void; onVoid: (row: Transaction) => Promise<void>;
}) {
  const [toVoid, setToVoid] = useState<Transaction | null>(null);
  const columns: Column<Transaction>[] = [
    { key: "date", title: "Payment date" },
    { key: "type", title: "Type", render: row => <Tag color={row.type === "income" ? "green" : "gold"}>{row.type}</Tag> },
    { key: "payee", title: "Client / payee" },
    { key: "category", title: "Category" },
    { key: "amount_paise", title: "Amount", render: row => <span className={row.status === "void" ? "line-through text-gray-400" : "font-semibold"}>{money(row.amount_paise)}</span> },
    { key: "payment_method", title: "Method" },
    { key: "reference", title: "Reference" },
    { key: "status", title: "Status", render: row => <span className={`status ${row.status}`}>{row.status === "active" ? "Active" : "Void"}</span> },
    { key: "actions", title: "Actions", render: row => <div className="table-actions">
      <button type="button" className="view-button" onClick={() => onView(row)}>Details</button>
      {row.status === "active" ? <>
        <button type="button" className="accounts-action-edit" disabled={busy} onClick={() => onEdit(row)}>Edit</button>
        <button type="button" className="accounts-action-void" disabled={busy} onClick={() => setToVoid(row)}>Void</button>
      </> : <>
        <span className="accounts-action-slot" aria-hidden="true" />
        <span className="accounts-action-slot" aria-hidden="true" />
      </>}
    </div> },
  ];
  return <>
    <DataTable columns={columns} data={rows} pageSize={10} loading={busy} />
    <DeleteConfirmationModal
      open={toVoid !== null}
      itemName={toVoid?.payee}
      title="Void this transaction?"
      actionText="Void"
      actionDescription="It stays in history but is excluded from totals."
      onCancel={() => setToVoid(null)}
      onConfirm={async () => {
        if (toVoid) await onVoid(toVoid);
        setToVoid(null);
      }}
    />
  </>;
}
