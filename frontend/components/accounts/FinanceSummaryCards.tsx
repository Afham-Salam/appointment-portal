import dayjs from "dayjs";
import { FiArrowDownLeft, FiArrowUpRight, FiBarChart2, FiCalendar, FiClock, FiLayers, FiRotateCcw, FiTrendingUp } from "react-icons/fi";
import { money, summarize } from "@/lib/accounts/formatters";
import type { Transaction } from "@/lib/accounts/types";

export default function FinanceSummaryCards({ totals, previous, transactions }: {
  totals: ReturnType<typeof summarize>;
  previous: ReturnType<typeof summarize> | null;
  transactions: Transaction[];
}) {
  const now = dayjs();
  const today = summarize(transactions.filter(row => row.date === now.format("YYYY-MM-DD")));
  const month = summarize(transactions.filter(row => row.date.startsWith(now.format("YYYY-MM"))));
  const year = summarize(transactions.filter(row => row.date.startsWith(now.format("YYYY"))));
  const change = (key: "income" | "expense" | "net") => {
    if (!previous || previous[key] === 0) return "No previous-period comparison";
    const percent = (totals[key] - previous[key]) / Math.abs(previous[key]) * 100;
    return `${percent >= 0 ? "+" : ""}${percent.toFixed(1)}% vs previous period`;
  };
  const cards = [
    { title: "Total income", value: totals.income, note: change("income"), Icon: FiArrowUpRight, color: "#2D5A3F", tint: "#e5efe4", background: "#f5faf3", label: "Selected period" },
    { title: "Total expenses", value: totals.expense, note: change("expense"), Icon: FiArrowDownLeft, color: "#a96c40", tint: "#f6e8da", background: "#fffaf4", label: "Selected period" },
    { title: "Net income", value: totals.net, note: change("net"), Icon: FiLayers, color: "#46776e", tint: "#dfede8", background: "#f3f9f6", label: "Selected period" },
    { title: "Pending client payments", value: 2230000, note: "3 clients · Sample outstanding balance", Icon: FiClock, color: "#ad7a2e", tint: "#f6ebd4", background: "#fffaf0", label: "Demo balance" },
    { title: "Total refunds", value: 250000, note: "1 transaction · Sample refund", Icon: FiRotateCcw, color: "#7a638e", tint: "#ece4f2", background: "#faf7fc", label: "Demo balance" },
    { title: "Today's income", value: today.income, note: `Today's expenses: ${money(today.expense)}`, Icon: FiCalendar, color: "#2D5A3F", tint: "#e5efe4", background: "#f5faf3", label: now.format("DD MMM YYYY") },
    { title: "This month's income", value: month.income, note: `This month's expenses: ${money(month.expense)}`, Icon: FiBarChart2, color: "#46776e", tint: "#dfede8", background: "#f3f9f6", label: now.format("MMMM YYYY") },
    { title: "This year's income", value: year.income, note: `This year's expenses: ${money(year.expense)}`, Icon: FiTrendingUp, color: "#847042", tint: "#eee8d7", background: "#fcfaf4", label: now.format("YYYY") },
  ];
  return <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {cards.map(({ title, value, note, Icon, color, tint, background, label }) => <article key={title}
      className="group relative min-w-0 overflow-hidden rounded-2xl border border-white p-5 shadow-[0_2px_12px_rgba(45,90,63,0.05)] ring-1 ring-[#2d5a3f]/8 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,90,63,0.10)] motion-reduce:transform-none"
      style={{ background: `linear-gradient(120deg, ${background}, #ffffff)` }}>
      <div aria-hidden="true" className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-40 transition-transform group-hover:scale-110" style={{ background: tint }} />
      <div className="relative flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-4 ring-white/70" style={{ color, background: tint }}><Icon className="h-5 w-5" aria-hidden="true" /></div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-semibold leading-5 text-[#536052]">{title}</h3>
          <p className="mt-1 break-words text-[23px] font-bold leading-tight tracking-tight tabular-nums text-[#203c2a]">{money(value)}</p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>{label}</p>
        </div>
      </div>
      <p className="relative mt-4 border-t border-[#2d5a3f]/8 pt-3 text-[11px] leading-5 text-[#657060]">{note}</p>
    </article>)}
  </div>;
}
