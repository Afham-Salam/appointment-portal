"use client";

import { useMemo, useState,useEffect } from "react";
import "./accounts.css";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Input,
  Select,
  Skeleton,
  Space,
  Spin,
  Tabs,
  Tag,
} from "antd";
import { FiMinus, FiPlus } from "react-icons/fi";
import FinanceSummaryCards from "@/components/accounts/FinanceSummaryCards";
import FinanceFilters, {
  type Period,
} from "@/components/accounts/FinanceFilters";
import TransactionFormModal from "@/components/accounts/TransactionFormModal";
import TransactionHistoryTable from "@/components/accounts/TransactionHistoryTable";
import TransactionDetailsDrawer from "@/components/accounts/TransactionDetailsDrawer";
import MonthlyYearlyReport from "@/components/accounts/MonthlyYearlyReport";
import PendingPaymentsTable, {
  type PendingPaymentClient,
} from "@/components/accounts/PendingPaymentsTable";
import { categories, paymentMethods } from "@/lib/accounts/constants";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  voidTransaction,
  getTransactionAudit,
  getPendingClientPayments,
} from "@/lib/actions/finance";
import { monthlyReport, summarize } from "@/lib/accounts/formatters";
import { exportFinance } from "@/lib/accounts/export";
import type {
  AuditEntry,
  Transaction,
  TransactionInput,
  TransactionType,
} from "@/lib/accounts/types";

const chartLoading = () => (
  <div className="flex h-75 items-center justify-center">
    <Spin />
  </div>
);
const IncomeExpenseChart = dynamic(
  () => import("@/components/accounts/charts/IncomeExpenseChart"),
  { ssr: false, loading: chartLoading },
);
const NetIncomeChart = dynamic(
  () => import("@/components/accounts/charts/NetIncomeChart"),
  { ssr: false, loading: chartLoading },
);
const CategoryBreakdownChart = dynamic(
  () => import("@/components/accounts/charts/CategoryBreakdownChart"),
  { ssr: false, loading: chartLoading },
);

function AccountsSkeleton() {
  return (
    <div className="accounts-page min-w-0 space-y-6 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton.Input active size="large" />
          <Skeleton.Input active size="small" />
        </div>
        <Skeleton.Button active size="large" />
      </div>

      <Card>
        <Skeleton active paragraph={{ rows: 1 }} title={false} />
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index}>
            <Skeleton active paragraph={{ rows: 2 }} title />
          </Card>
        ))}
      </div>

      <Skeleton active paragraph={{ rows: 1 }} title={false} />

      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index}>
            <Skeleton active paragraph={{ rows: 7 }} title />
          </Card>
        ))}
      </div>

      <Card title={<Skeleton.Input active size="small" />}>
        <Skeleton active paragraph={{ rows: 8 }} title={false} />
      </Card>
    </div>
  );
}

function AccountsContent() {
  const { message } = App.useApp();
 const [transactions, setTransactions] = useState<Transaction[]>([]);
 const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>(() => ({
    mode: "Monthly",
    from: dayjs().startOf("month").format("YYYY-MM-DD"),
    to: dayjs().format("YYYY-MM-DD"),
  }));
  const [form, setForm] = useState<{
    type: TransactionType;
    transaction?: Transaction;
  } | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [method, setMethod] = useState("all");
  const [status, setStatus] = useState("all");
  const [exporting, setExporting] = useState(false);
  const [pendingPayments, setPendingPayments] = useState<{
    pending: number;
    clientCount: number;
    clients: PendingPaymentClient[];
  } | undefined>(undefined);
  const [pendingPaymentsLoading, setPendingPaymentsLoading] = useState(true);

  const fetchPendingPayments = async () => {
    setPendingPaymentsLoading(true);
    try {
      const data = await getPendingClientPayments();
      if (data.error) {
        message.error("Could not load pending client payments.");
        return;
      }
      setPendingPayments(data);
    } finally {
      setPendingPaymentsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { transactions: data } = await getTransactions();
      setTransactions(data);
    } finally {
      setLoading(false);
    }
  };
 useEffect(() => {
    fetchTransactions();
    fetchPendingPayments();
  }, [message]);

  useEffect(() => {
    if (detailId) {
      getTransactionAudit(detailId).then(({ entries }) => {
        setAuditEntries(entries);
      });
    }
  }, [detailId]);

  const rows = useMemo(
    () =>
      transactions
        .filter((row) => row.date >= period.from && row.date <= period.to)
        .sort(
          (a, b) =>
            b.date.localeCompare(a.date) ||
            b.created_at.localeCompare(a.created_at),
        ),
    [transactions, period],
  );
  const totals = summarize(rows);
  const report = monthlyReport(rows, period.from, period.to, period.mode);
  const previousRange = (() => {
    const days = dayjs(period.to).diff(dayjs(period.from), "day") + 1;
    return {
      from: dayjs(period.from).subtract(days, "day").format("YYYY-MM-DD"),
      to: dayjs(period.from).subtract(1, "day").format("YYYY-MM-DD"),
    };
  })();
  const previousRows = transactions.filter(
    (row) =>
      row.date >= previousRange.from &&
      row.date <= previousRange.to &&
      row.status === "active",
  );
  const filteredRows = rows.filter(
    (row) =>
      (type === "all" || row.type === type) &&
      (category === "all" || row.category === category) &&
      (method === "all" || row.payment_method === method) &&
      (status === "all" || row.status === status) &&
      `${row.payee} ${row.reference} ${row.notes} ${row.category}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const expenseBreakdown = categories.expense.map((category) => ({
    category,
    amount: rows
      .filter(
        (row) =>
          row.type === "expense" &&
          row.status === "active" &&
          row.category === category,
      )
      .reduce((sum, row) => sum + row.amount_paise, 0),
  }));
  const detail = transactions.find((row) => row.id === detailId);

   const save = async (input: TransactionInput) => {
    const before = form?.transaction || null;
    const { amount, ...fields } = input;

    if (before) {
      const result = await updateTransaction(before.id, {
        ...fields,
        amount_paise: Math.round(amount * 100),
      });
      if (result.error) {
        message.error(result.error);
        return;
      }
    } else {
      const result = await createTransaction({
        ...fields,
        amount_paise: Math.round(amount * 100),
      });
      if (result.error) {
        message.error(result.error);
        return;
      }
    }

    setForm(null);
    fetchTransactions();
    fetchPendingPayments();
    message.success(before ? "Transaction updated." : "Transaction saved.");
  };
   const voidRow = async (before: Transaction) => {
    const result = await voidTransaction(before.id);
    if (result.error) {
      message.error(result.error);
      return;
    }
    fetchTransactions();
    fetchPendingPayments();
    message.success("Transaction deleted. Totals have been updated.");
  };
  const download = async () => {
    setExporting(true);
    try {
      await exportFinance(filteredRows, rows, period.from, period.to, period.mode);
    } catch {
      message.error("Could not export the report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <AccountsSkeleton />;
  }

  return (
    <div className="accounts-page min-w-0 space-y-6 pb-8">
      <div className="page-heading flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1>Accounts</h1>
          </div>
          <p>
            Clinic income, expenses and financial reports — all in one place.
          </p>
        </div>
        <Space wrap>
          <Button
            icon={<FiMinus />}
            onClick={() => setForm({ type: "expense" })}
          >
            Add expense
          </Button>
          <Button
            type="primary"
            icon={<FiPlus />}
            onClick={() => setForm({ type: "income" })}
          >
            Add income
          </Button>
        </Space>
      </div>
        <FinanceFilters
          value={period}
          exporting={exporting}
          onExport={download}
          onChange={(value) => {
            if (dayjs(value.to).diff(dayjs(value.from), "year") > 10) {
              message.warning("Choose a date range of ten years or less.");
              return;
            }
            setPeriod(value);
          }}
        />
      <FinanceSummaryCards
        transactions={transactions}
        totals={totals}
        previous={previousRows.length ? summarize(previousRows) : null}
        pendingPayments={pendingPayments}
      />
      <p className="text-xs text-gray-500">
        INR · January–December reporting year · {period.from} to {period.to} ·
        Based on payment date. Voided entries excluded from totals.
      </p>
      <Tabs
        items={[
          {
            key: "overview",
            label: "Financial overview",
            children: (
              <div className="grid gap-5 lg:grid-cols-2">
                <Card title="Income vs expenses">
                  <IncomeExpenseChart rows={report} />
                </Card>
                <Card title="Net income trend">
                  <NetIncomeChart rows={report} />
                </Card>
                <Card title="Where your money goes">
                  <CategoryBreakdownChart data={expenseBreakdown} />
                </Card>
                <Card title="Income sources">
                  <CategoryBreakdownChart
                    data={[
                      { category: "Client payments", amount: totals.client },
                      { category: "Other income", amount: totals.other },
                    ]}
                  />
                </Card>
              </div>
            ),
          },
          {
            key: "reports",
            label: "Financial report",
            children: (
              <Card title={`${period.mode} financial summary`}>
                <p className="mb-4 text-sm text-gray-500">
                  Choose any date range, including a full year for an annual report.
                  The Daily / Monthly toggle controls the breakdown. Amounts are in INR.
                </p>
                <MonthlyYearlyReport rows={report} grouping={period.mode} />
              </Card>
            ),
          },
          {
            key: "pending-payments",
            label: "Pending payments",
            children: (
              <Card
                title="Pending client payments"
                extra={
                  pendingPayments ? (
                    <Tag>{pendingPayments.clientCount} clients</Tag>
                  ) : undefined
                }
                styles={{ body: { padding: 0 } }}
              >
                <PendingPaymentsTable
                  rows={pendingPayments?.clients || []}
                  loading={pendingPaymentsLoading}
                  onUpdated={fetchPendingPayments}
                />
              </Card>
            ),
          },
        ]}
      />
      <Card
        className="mt-6!"
        title="Transaction history"
        extra={<Tag>{filteredRows.length} transactions</Tag>}
        styles={{ body: { padding: 0 } }}
      >
        <div className="flex flex-wrap gap-3 p-5">
          <Input.Search
            aria-label="Search transactions"
            placeholder="Search client, payee or reference"
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 270 }}
          />
          <Select
            aria-label="Transaction type"
            value={type}
            onChange={(value) => {
              setType(value);
              setCategory("all");
            }}
            style={{ width: 140 }}
            options={[
              { value: "all", label: "All types" },
              { value: "income", label: "Income" },
              { value: "expense", label: "Expenses" },
            ]}
          />
          <Select
            aria-label="Category"
            value={category}
            onChange={setCategory}
            style={{ width: 180 }}
            options={[
              { value: "all", label: "All categories" },
              ...(type === "all"
                ? [...categories.income, ...categories.expense]
                : categories[type as TransactionType]
              ).map((value) => ({ value, label: value })),
            ]}
          />
          <Select
            aria-label="Payment method"
            value={method}
            onChange={setMethod}
            style={{ width: 160 }}
            options={[
              { value: "all", label: "All methods" },
              ...paymentMethods.map((value) => ({ value, label: value })),
            ]}
          />
          <Select
            aria-label="Status"
            value={status}
            onChange={setStatus}
            style={{ width: 130 }}
            options={[
              { value: "all", label: "All statuses" },
              { value: "active", label: "Active" },
              { value: "void", label: "Deleted" },
            ]}
          />
          <Button
            type="text"
            onClick={() => {
              setSearch("");
              setType("all");
              setCategory("all");
              setMethod("all");
              setStatus("all");
            }}
          >
            Reset filters
          </Button>
        </div>
        <p className="px-5 text-xs text-gray-500">
          Table filters affect transaction history and its export. Summary cards
          and charts show the entire selected date period.
        </p>
        <TransactionHistoryTable
          key={`${period.from}-${period.to}-${type}-${category}-${method}-${status}-${search}`}
          rows={filteredRows}
          busy={loading}
          onEdit={(transaction) =>
            setForm({ type: transaction.type, transaction })
          }
          onView={(row) => setDetailId(row.id)}
          onVoid={voidRow}
        />
      </Card>
      {form && (
        <TransactionFormModal
          key={form.transaction?.id || form.type}
          {...form}
          onClose={() => setForm(null)}
          onSaved={save}
        />
      )}
      {detail && (
    <TransactionDetailsDrawer
      key={detail.id}
      transaction={detail}
      entries={auditEntries}
      onClose={() => setDetailId(null)}
    />
  )}
    </div>
  );
}

export default function AccountsClient() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2D5A3F",
          colorInfo: "#2D5A3F",
          colorBgLayout: "#edede8",
          borderRadius: 10,
          fontFamily: "var(--font-manrope), sans-serif",
        },
        components: {
          Segmented: { itemSelectedBg: "#2D5A3F", itemSelectedColor: "#ffffff", trackBg: "#f3f5f0" },
        },
      }}
    >
      <App>
        <AccountsContent />
      </App>
    </ConfigProvider>
  );
}
