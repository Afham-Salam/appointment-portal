"use client";
import { useState } from "react";
import { Alert, DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { categories, paymentMethods } from "@/lib/accounts/constants";
import { demoClients } from "@/lib/accounts/demo-data";
import { validateTransaction } from "@/lib/accounts/validation";
import type { Transaction, TransactionInput, TransactionType } from "@/lib/accounts/types";

type Fields = Omit<TransactionInput, "date"> & { date: Dayjs };
export default function TransactionFormModal({ type, transaction, onClose, onSaved }: {
  type: TransactionType; transaction?: Transaction; onClose: () => void; onSaved: (value: TransactionInput) => void;
}) {
  const [form] = Form.useForm<Fields>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const clients = demoClients;
  const source = Form.useWatch("source", form);
  const submit = async (values: Fields) => {
    setSaving(true); setError("");
    try {
      const record = { ...values, type, source: type === "expense" ? "other" as const : values.source, date: values.date.format("YYYY-MM-DD"), client_id: type === "income" && values.source === "client" ? values.client_id || null : null };
      const invalid = validateTransaction(record);
      if (invalid) setError(invalid);
      else onSaved(record);
    } catch { setError("Could not save the transaction. Please try again."); }
    finally { setSaving(false); }
  };
  return <Modal open className="accounts-form" width="min(560px, calc(100vw - 24px))" styles={{ body: { maxHeight: "calc(100dvh - 200px)", overflowY: "auto", overflowX: "hidden" } }} title={`${transaction ? "Edit" : "Add"} ${type}`} onCancel={() => !saving && onClose()} onOk={() => form.submit()} confirmLoading={saving} okText="Save transaction" cancelButtonProps={{ disabled: saving }} maskClosable={!saving} closable={!saving}>
    {error && <Alert type="error" showIcon title={error} className="mb-4" />}
    <Form form={form} layout="vertical" onFinish={submit} initialValues={transaction ? {
      ...transaction, amount: transaction.amount_paise / 100, date: dayjs(transaction.date),
    } : { date: dayjs(), source: type === "income" ? "client" : "other", category: categories[type][0], payment_method: "Cash", client_id: null, payee: "", reference: "", notes: "" }}>
      <div className="grid min-w-0 grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Form.Item name="date" label="Payment date" rules={[{ required: true }]}><DatePicker className="w-full" /></Form.Item>
        <Form.Item name="amount" label="Amount (₹)" rules={[{ required: true, type: "number", min: 0.01, max: 100000000 }]}><InputNumber min={0.01} max={100000000} precision={2} className="!w-full" /></Form.Item>
      </div>
      {type === "income" && <Form.Item name="source" label="Income source"><Select options={[{ value: "client", label: "Client payment" }, { value: "other", label: "Other income" }]} /></Form.Item>}
      {type === "income" && source === "client" && <Form.Item name="client_id" label="Link sample client (optional)"><Select showSearch optionFilterProp="label" allowClear placeholder="Search client name" options={[
        ...(transaction?.client_id && !clients.some(c => c.id === transaction.client_id) ? [{ value: transaction.client_id, label: transaction.payee }] : []),
        ...clients.map(c => ({ value: c.id, label: `${c.name} · ${c.phone}` })),
      ]} onChange={id => { const client = clients.find(c => c.id === id); if (client) form.setFieldValue("payee", client.name); }} /></Form.Item>}
      <Form.Item name="payee" label={type === "income" ? "Received from" : "Paid to / vendor"} rules={[{ required: true, whitespace: true }]}><Input maxLength={200} /></Form.Item>
      <div className="grid min-w-0 grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Form.Item name="category" label="Category" rules={[{ required: true }]}><Select options={categories[type].map(value => ({ value, label: value }))} /></Form.Item>
        <Form.Item name="payment_method" label="Payment method" rules={[{ required: true }]}><Select options={paymentMethods.map(value => ({ value, label: value }))} /></Form.Item>
      </div>
      <Form.Item name="reference" label="Receipt / reference"><Input maxLength={200} /></Form.Item>
      <Form.Item name="notes" label="Notes"><Input.TextArea rows={3} maxLength={2000} showCount /></Form.Item>
    </Form>
  </Modal>;
}
