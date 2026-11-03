"use client";

import { useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Tag,
} from "antd";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { DataTable, type Column } from "@/components/ui/DataTable";
import dayjs from "dayjs";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";

export type BankTransfer = {
  id: string;
  date: string;
  amount: number;
  reference: string;
  notes: string;
  created_at: string;
};

const rupee = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function BankTransferSection({
  transfers,
  loading,
  onAdd,
  onDelete,
}: {
  transfers: BankTransfer[];
  loading: boolean;
  onAdd: (data: {
    date: string;
    amount: number;
    reference: string;
    notes: string;
  }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTransfer, setDeleteTransfer] = useState<BankTransfer | null>(
    null,
  );
  const [form] = Form.useForm();

  const total = transfers.reduce((sum, t) => sum + Number(t.amount), 0);

  const columns: Column<BankTransfer>[] = [
    {
      key: "date",
      title: "Date",
      render: (row) => dayjs(row.date).format("DD MMM YYYY"),
    },
    {
      key: "amount",
      title: "Amount",
      render: (row) => (
        <span className="font-semibold">{rupee(Number(row.amount))}</span>
      ),
    },
    {
      key: "reference",
      title: "Reference",
      render: (row) => row.reference || "—",
    },
    { key: "notes", title: "Notes", render: (row) => row.notes || "—" },
    {
      key: "actions",
      title: "",
      render: (row) => (
        <button
          type="button"
          className="cursor-pointer rounded-md border border-red-200 bg-white p-1.5 text-red-500 hover:bg-red-50"
          title="Delete transfer"
          onClick={() => setDeleteTransfer(row)}
        >
          <FiTrash2 className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ];

  const handleSubmit = async () => {
    const values = await form.validateFields();
    setSaving(true);
    await onAdd({
      date: values.date.format("YYYY-MM-DD"),
      amount: values.amount,
      reference: values.reference?.trim() || "",
      notes: values.notes?.trim() || "",
    });
    setSaving(false);
    form.resetFields();
    form.setFieldsValue({ date: dayjs() });
    setShowForm(false);
  };

  return (
    <>
      <Card
        className="mt-6!"
        title="Bank transfers"
        extra={
          <div className="flex items-center gap-3">
            <Tag color="blue">{rupee(total)} transferred</Tag>
            <Button
              type="primary"
              icon={<FiPlus />}
              onClick={() => setShowForm(true)}
            >
              Add Transfer
            </Button>
          </div>
        }
        styles={{ body: { padding: 0 } }}
      >
        <DataTable
          columns={columns}
          data={transfers}
          loading={loading}
          pageSize={10}
        />
      </Card>

      <Modal
        title={
          <span className="text-lg font-semibold text-[#144229]">
            Record Bank Transfer
          </span>
        }
        open={showForm}
        onCancel={() => setShowForm(false)}
        onOk={handleSubmit}
        confirmLoading={saving}
        okText="Save Transfer"
        okButtonProps={{
          className:
            "h-11! bg-[#2D5A3F]! font-semibold! text-white! hover:bg-[#16482b]!",
        }}
        cancelButtonProps={{
          className: "h-11! border-[#c1c9c0]! text-[#414942]!",
        }}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          initialValues={{ date: dayjs() }}
          className="pt-2 [&_.ant-form-item-label>label]:text-[13px]! [&_.ant-form-item-label>label]:font-medium! [&_.ant-form-item-label>label]:text-[#144229]!"
        >
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
              <DatePicker className="w-full!" format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              name="amount"
              label="Amount (₹)"
              rules={[
                {
                  required: true,
                  type: "number",
                  min: 1,
                  message: "Enter amount",
                },
              ]}
            >
              <InputNumber
                min={1}
                precision={2}
                placeholder="0.00"
                className="w-full!"
              />
            </Form.Item>
          </div>
          <Form.Item name="reference" label="UTR / Reference number">
            <Input placeholder="e.g. UTR123456789" />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} placeholder="Optional notes" />
          </Form.Item>
        </Form>
      </Modal>

      <DeleteConfirmationModal
        open={!!deleteTransfer}
        title="Delete this transfer?"
        itemName={deleteTransfer ? rupee(Number(deleteTransfer.amount)) : ""}
        actionDescription="This transfer record will be permanently deleted."
        onCancel={() => setDeleteTransfer(null)}
        onConfirm={async () => {
          if (deleteTransfer) await onDelete(deleteTransfer.id);
          setDeleteTransfer(null);
        }}
      />
    </>
  );
}
