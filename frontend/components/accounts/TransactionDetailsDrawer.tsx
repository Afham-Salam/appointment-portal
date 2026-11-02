"use client";
import { Descriptions, Drawer, Empty, Timeline } from "antd";
import { money } from "@/lib/accounts/formatters";
import type { AuditEntry, Transaction } from "@/lib/accounts/types";

export default function TransactionDetailsDrawer({ transaction, entries, onClose }: { transaction: Transaction; entries: AuditEntry[]; onClose: () => void }) {
  return <Drawer open onClose={onClose} title="Transaction details" className="accounts-details" styles={{ wrapper: { width: "min(736px, 100vw)" }, body: { overflowWrap: "anywhere" } }}>
    <Descriptions bordered column={1} items={[
      { key: "id", label: "Transaction ID", children: transaction.id },
      { key: "date", label: "Payment date", children: transaction.date },
      { key: "amount", label: "Amount", children: money(transaction.amount_paise) },
      { key: "type", label: "Type / status", children: `${transaction.type} / ${transaction.status === "void" ? "deleted" : transaction.status}` },
      { key: "payee", label: "Client / payee", children: transaction.payee },
      { key: "category", label: "Category", children: transaction.category },
      { key: "method", label: "Payment method", children: transaction.payment_method },
      { key: "reference", label: "Reference", children: transaction.reference || "—" },
      { key: "notes", label: "Notes", children: <span className="whitespace-pre-wrap">{transaction.notes || "—"}</span> },
    ]} />
    <h3 className="my-6 text-lg font-semibold">Change history</h3>
    {!entries.length ? <Empty description="No history" /> : <Timeline items={entries.map(entry => ({
      content: <div><strong>{entry.action}</strong><p className="text-xs text-gray-500">{new Date(entry.occurred_at).toLocaleString()} · User {entry.actor}</p>
        {entry.before_data && <ul className="mt-2 text-sm">{(["date", "amount_paise", "category", "source", "client_id", "payee", "payment_method", "reference", "notes", "status"] as const).filter(key => entry.before_data?.[key] !== entry.after_data[key]).map(key => <li key={key}><strong>{key.replaceAll("_", " ")}:</strong> {key === "amount_paise" ? money(entry.before_data!.amount_paise) : String(entry.before_data![key] || "—")} → {key === "amount_paise" ? money(entry.after_data.amount_paise) : String(entry.after_data[key] || "—")}</li>)}</ul>}
      </div>,
    }))} />}
  </Drawer>;
}
