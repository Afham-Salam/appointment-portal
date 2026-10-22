"use client";
import { Button, DatePicker, Segmented } from "antd";
import dayjs from "dayjs";
import { FiDownload } from "react-icons/fi";
import { FiCalendar, FiClock } from "react-icons/fi";

export type Period = { mode: "Daily" | "Monthly"; from: string; to: string };
export default function FinanceFilters({ value, onChange, onExport, exporting }: {
  value: Period; onChange: (value: Period) => void; onExport: () => void; exporting: boolean;
}) {
  const preset = (kind: "week" | "month") => {
    const today = dayjs();
    // Previous complete Monday–Sunday week, or previous calendar month.
    const start = kind === "month" ? today.subtract(1, "month").startOf("month")
      : today.startOf("day").subtract((today.day() + 6) % 7 + 7, "day");
    const end = kind === "month" ? start.endOf("month") : start.add(6, "day");
    onChange({ mode: "Monthly", from: start.format("YYYY-MM-DD"), to: end.format("YYYY-MM-DD") });
  };
  return <div className="accounts-toolbar flex min-w-0 flex-wrap items-center justify-end gap-2 rounded-xl bg-white p-3">
    <div className="flex items-center gap-2">
      {([{ kind: "week", label: "Last Week", Icon: FiClock }, { kind: "month", label: "Last Month", Icon: FiCalendar }] as const).map(({ kind, label, Icon }) => {
        const today = dayjs();
        const start = kind === "month" ? today.subtract(1, "month").startOf("month") : today.startOf("day").subtract((today.day() + 6) % 7 + 7, "day");
        const end = kind === "month" ? start.endOf("month") : start.add(6, "day");
        const active = value.from === start.format("YYYY-MM-DD") && value.to === end.format("YYYY-MM-DD");
        return <button key={kind} type="button" aria-pressed={active} onClick={() => preset(kind)} className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D5A3F] ${active ? "bg-[#2D5A3F] text-white shadow-sm" : "bg-[#edf3eb] text-[#2D5A3F] hover:bg-[#dfeadd] hover:shadow-sm"}`}>
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />{label}
        </button>;
      })}
    </div>
    {value.mode === "Daily" ? <DatePicker className="accounts-date-range w-full sm:w-auto" aria-label="Report date" allowClear={false} format="YYYY-MM-DD" value={dayjs(value.from)} onChange={date => {
      if (date) onChange({ ...value, from: date.format("YYYY-MM-DD"), to: date.format("YYYY-MM-DD") });
    }} /> : <DatePicker.RangePicker className="accounts-date-range w-full sm:w-auto" classNames={{ popup: { root: "accounts-date-popup" } }} allowClear={false} format="YYYY-MM-DD" value={[dayjs(value.from), dayjs(value.to)]} onChange={dates => {
      if (dates?.[0] && dates[1]) onChange({ ...value, from: dates[0].format("YYYY-MM-DD"), to: dates[1].format("YYYY-MM-DD") });
    }} />}
    <Segmented className="[&_.ant-segmented-item-label]:!flex [&_.ant-segmented-item-label]:!h-8 [&_.ant-segmented-item-label]:!items-center [&_.ant-segmented-item-label]:!py-0" aria-label="Report grouping" options={["Daily", "Monthly"]} value={value.mode} onChange={mode => {
      const date = dayjs(value.from);
      onChange(mode === "Daily" ? { mode, from: value.from, to: value.from }
        : { mode: "Monthly", from: date.startOf("month").format("YYYY-MM-DD"), to: date.endOf("month").format("YYYY-MM-DD") });
    }} />
    <Button type="primary" icon={<FiDownload />} loading={exporting} onClick={onExport}>Export</Button>
  </div>;
}
