"use client";
import { useState } from "react";
import { Alert, ConfigProvider, DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { categories, paymentMethods } from "@/lib/accounts/constants";
import { validateTransaction } from "@/lib/accounts/validation";
import type { Transaction, TransactionInput, TransactionType } from "@/lib/accounts/types";
import { searchClientsForDropdown } from "@/lib/actions/finance";

const themeConfig = {
  token: {
    colorPrimary: "#2D5A3F",
    colorLink: "#144229",
    borderRadius: 6,
    controlHeight: 44,
    fontFamily: "var(--font-manrope), system-ui, sans-serif",
  },
  components: {
    Input: {
      colorBgContainer: "#ffffff",
      colorBorder: "#c1c9c0",
      hoverBorderColor: "#2D5A3F",
      activeBorderColor: "#144229",
      activeShadow: "0 0 0 2px rgba(45, 90, 63, 0.15)",
    },
    InputNumber: {
      colorBgContainer: "#ffffff",
      colorBorder: "#c1c9c0",
      hoverBorderColor: "#2D5A3F",
      activeBorderColor: "#144229",
      activeShadow: "0 0 0 2px rgba(45, 90, 63, 0.15)",
    },
    DatePicker: {
      colorBgContainer: "#ffffff",
      colorBorder: "#c1c9c0",
      hoverBorderColor: "#2D5A3F",
      activeBorderColor: "#144229",
    },
    Select: {
      colorBgContainer: "#ffffff",
      colorBorder: "#c1c9c0",
      hoverBorderColor: "#2D5A3F",
      activeBorderColor: "#144229",
      optionSelectedBg: "#bceecb",
      optionSelectedColor: "#144229",
      optionActiveBg: "#e8f7ee",
    },
    Button: {
      primaryColor: "#ffffff",
    },
  },
};

const selectPopupClassName =
  "[&_.ant-select-item-option-active]:bg-[#e8f7ee]! [&_.ant-select-item-option-selected]:bg-[#bceecb]! [&_.ant-select-item-option-selected]:text-[#144229]! [&_.ant-select-item-option-selected]:font-semibold!";

const fieldClass =
  "[&_.ant-form-item]:mb-3! [&_.ant-form-item-label]:pb-1! [&_.ant-form-item-label>label]:text-[13px]! [&_.ant-form-item-label>label]:font-medium! [&_.ant-form-item-label>label]:text-[#144229]!";

type Fields = Omit<TransactionInput, "date"> & { date: Dayjs };
export default function TransactionFormModal({ type, transaction, onClose, onSaved }: {
  type: TransactionType; transaction?: Transaction; onClose: () => void; onSaved: (value: TransactionInput) => void;
}) {
  const [form] = Form.useForm<Fields>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [clients, setClients] = useState<{ id: string; name: string; phone: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const source = Form.useWatch("source", form);

  const handleClientSearch = async (value: string) => {
    if (value.length < 2) {
      setClients([]);
      return;
    }
    setSearching(true);
    const results = await searchClientsForDropdown(value);
    setClients(results);
    setSearching(false);
  };

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

  return (
    <ConfigProvider theme={themeConfig}>
      <Modal
        open
        className="accounts-form px-3 sm:px-0"
        width="100%"
        style={{ maxWidth: 720, top: 16, paddingBottom: 0 }}
        styles={{ body: { maxHeight: "70vh", overflowY: "auto", padding: " 2px" } }}
        title={
          <span className="text-lg font-semibold capitalize tracking-wide text-[#144229]">
            {transaction ? "Edit" : "Add"} {type}
          </span>
        }
        onCancel={() => !saving && onClose()}
        onOk={() => form.submit()}
        confirmLoading={saving}
        okText="Save transaction"
        cancelText="Cancel"
        cancelButtonProps={{
          disabled: saving,
          className: "h-11! border-[#c1c9c0]! text-[#414942]! hover:border-[#2D5A3F]! hover:text-[#2D5A3F]!",
        }}
        okButtonProps={{
          className: "h-11! bg-[#2D5A3F]! font-semibold! text-white! hover:bg-[#16482b]! hover:text-white!",
        }}
        mask={{ closable: !saving }}
        closable={!saving}
      >
        {error && <Alert type="error" showIcon title={error} className="mb-4!" />}
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={submit}
          className={fieldClass}
          initialValues={transaction ? {
            ...transaction, amount: transaction.amount_paise / 100, date: dayjs(transaction.date),
          } : { date: dayjs(), source: type === "income" ? "client" : "other", category: categories[type][0], payment_method: "Cash", client_id: null, payee: "", reference: "", notes: "" }}
        >
          <div className="grid min-w-0 grid-cols-1 gap-x-3 sm:grid-cols-2">
            <Form.Item name="date" label="Payment date" rules={[{ required: true }]}>
              <DatePicker className="w-full! rounded-md!" />
            </Form.Item>
            <Form.Item name="amount" label="Amount (₹)" rules={[{ required: true, type: "number", min: 0.01, max: 100000000 }]}>
              <InputNumber min={0.01} max={100000000} precision={2} className="w-full! rounded-md!" />
            </Form.Item>
          </div>
          {type === "income" && (
            <Form.Item name="source" label="Income source">
              <Select
                className="w-full [&_.ant-select-selector]:rounded-md!"
                classNames={{ popup: { root: selectPopupClassName } }}
                options={[{ value: "client", label: "Client payment" }, { value: "other", label: "Other income" }]}
              />
            </Form.Item>
          )}
          {type === "income" && source === "client" && (
            <Form.Item name="client_id" label="Received from client">
              <Select
                showSearch
                allowClear
                placeholder="Type 2+ letters to search"
                filterOption={false}
                onSearch={handleClientSearch}
                loading={searching}
                notFoundContent={searching ? "Searching..." : "Type to search"}
                className="w-full [&_.ant-select-selector]:rounded-md!"
                classNames={{ popup: { root: selectPopupClassName } }}
                options={[
                  ...(transaction?.client_id && !clients.some(c => c.id === transaction.client_id) ? [{ value: transaction.client_id, label: transaction.payee }] : []),
                  ...clients.map(c => ({ value: c.id, label: `${c.name} · ${c.phone}` })),
                ]}
                onChange={id => { const client = clients.find(c => c.id === id); if (client) form.setFieldValue("payee", client.name); }}
              />
            </Form.Item>
          )}
          <Form.Item name="payee" label={type === "income" ? "Received from" : "Paid to / vendor"} rules={[{ required: true, whitespace: true }]}>
            <Input maxLength={200} className="rounded-md!" />
          </Form.Item>
          <div className="grid min-w-0 grid-cols-1 gap-x-3 sm:grid-cols-2">
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select
                className="w-full [&_.ant-select-selector]:rounded-md!"
                classNames={{ popup: { root: selectPopupClassName } }}
                options={categories[type].map(value => ({ value, label: value }))}
              />
            </Form.Item>
            <Form.Item name="payment_method" label="Payment method" rules={[{ required: true }]}>
              <Select
                className="w-full [&_.ant-select-selector]:rounded-md!"
                classNames={{ popup: { root: selectPopupClassName } }}
                options={paymentMethods.map(value => ({ value, label: value }))}
              />
            </Form.Item>
          </div>
          <Form.Item name="reference" label="Receipt / reference">
            <Input maxLength={200} className="rounded-md!" />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} maxLength={2000} showCount className="min-h-24! rounded-md! resize-y!" />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}
