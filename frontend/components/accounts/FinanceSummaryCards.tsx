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
    { title: "Total income", value: totals.income, note: change("income"), Icon: FiArrowUpRight, color: "#144229", tint: "#e5eddf", dot: "#2D5A3F", label: "Selected period", highlighted: true },
    { title: "Total expenses", value: totals.expense, note: change("expense"), Icon: FiArrowDownLeft, color: "#8c4a27", tint: "#f7e6db", dot: "#b86439", label: "Selected period" },
    { title: "Net income", value: totals.net, note: change("net"), Icon: FiLayers, color: "#1f5a4c", tint: "#dff0ea", dot: "#2d7a67", label: "Selected period" },
    { title: "Pending client payments", value: 2230000, note: "3 clients · Sample outstanding balance", Icon: FiClock, color: "#7a5a22", tint: "#f5ebd3", dot: "#a87e33", label: "Demo balance" },
    { title: "Total refunds", value: 250000, note: "1 transaction · Sample refund", Icon: FiRotateCcw, color: "#65497a", tint: "#ede3f3", dot: "#85649c", label: "Demo balance" },
    { title: "Today's income", value: today.income, note: `Today's expenses: ${money(today.expense)}`, Icon: FiCalendar, color: "#2D5A3F", tint: "#e5eddf", dot: "#2D5A3F", label: now.format("DD MMM YYYY") },
    { title: "This month's income", value: month.income, note: `This month's expenses: ${money(month.expense)}`, Icon: FiBarChart2, color: "#1f5a4c", tint: "#dff0ea", dot: "#2d7a67", label: now.format("MMM YYYY") },
    { title: "This year's income", value: year.income, note: `This year's expenses: ${money(year.expense)}`, Icon: FiTrendingUp, color: "#7a5a22", tint: "#f3ead6", dot: "#9b7832", label: now.format("YYYY") },
  ];
  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {cards.map(({ title, value, note, Icon, color, tint, dot, label, highlighted }) => (
        <article
          key={title}
          className={`group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl p-4 transition duration-200 hover:-translate-y-0.5 sm:p-5 motion-reduce:transform-none ${
            highlighted
              ? "bg-linear-to-br from-[#34694a] via-[#2D5A3F] to-[#193d2a] text-white shadow-[0_8px_24px_rgba(45,90,63,0.20)]"
              : "border border-[#dce4d8] bg-linear-to-br from-white via-white to-[#f4f7f1] shadow-[0_3px_14px_rgba(20,66,41,0.05)] hover:border-[#b8c8b2] hover:shadow-[0_10px_26px_rgba(20,66,41,0.10)]"
          }`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-7 -top-7 h-24 w-24 rounded-full transition-transform duration-300 group-hover:scale-110 sm:h-28 sm:w-28"
            style={{ background: highlighted ? "rgba(255,255,255,0.07)" : tint, opacity: highlighted ? 1 : 0.65 }}
          />

          <div className="relative flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className={`m-0 truncate text-xs font-semibold leading-5 ${highlighted ? "text-[#e3efdf]" : "text-[#536350]"}`}>
                  {title}
                </h3>
              </div>
              <p
                className={`mb-0 mt-2 break-words font-bold leading-tight tracking-tight tabular-nums text-[clamp(1.25rem,2vw,1.65rem)] ${
                  highlighted ? "text-white" : "text-[#183523]"
                }`}
              >
                {money(value)}
              </p>
              <span
                className={`mt-2 inline-flex max-w-full items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  highlighted ? "bg-white/14 text-[#f0dfb4]" : ""
                }`}
                style={highlighted ? undefined : { background: tint, color }}
              >
                <span className="truncate">{label}</span>
              </span>
            </div>

            <span
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl ${
                highlighted ? "bg-white/15 text-[#f0dfb4] ring-1 ring-white/20" : "ring-4 ring-white/90"
              }`}
              style={highlighted ? undefined : { color, background: tint }}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </span>
          </div>

          <div
            className={`relative mt-4 flex min-w-0 items-center gap-2 border-t pt-3 text-[11px] font-medium leading-4 ${
              highlighted ? "border-white/15 text-[#dfebdc]" : "border-[#e2e8dd] text-[#667362]"
            }`}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: highlighted ? "#e5cb88" : dot }}
            />
            <span className="truncate" title={note}>{note}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
