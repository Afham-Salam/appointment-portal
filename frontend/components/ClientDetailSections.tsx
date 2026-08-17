"use client";

import type { ReactNode } from "react";
import * as React from "react";
import { Collapse, DatePicker } from "antd";
import { FiDownload, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

export function Field({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] text-[#144229]">
      <span className="font-medium">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-11 rounded-md border border-[#c1c9c0] bg-white px-3 text-sm text-[#1a1c1a] outline-none transition focus:border-[#2D5A3F] focus:ring-2 focus:ring-[#2D5A3F]/15 disabled:bg-[#f4f4f0] disabled:text-[#414942]"
      />
    </label>
  );
}

export function FormSection({
  title,
  children,
  open,
  onToggle,
  onEdit,
  onDownload,
}: {
  title: string;
  children: ReactNode;
  open: boolean;
  onToggle: () => void;
  editable?: boolean;
  onEdit: () => void;
  onDownload?: () => void;
}) {
  return (
    <Collapse
      className="mt-5! overflow-hidden rounded-lg border border-[#c1c9c0] bg-white [&_.ant-collapse-header]:items-center! [&_.ant-collapse-header]:py-4! [&_.ant-collapse-header-text]:text-[#144229]!"
      activeKey={open ? ["section"] : []}
      onChange={onToggle}
      items={[{
        key: "section",
        label: <strong>{title}</strong>,
        extra: (
          <div className="flex items-center gap-1">
            <button type="button" className="flex h-8 w-8 items-center justify-center text-[#144229]" onClick={(event) => { event.stopPropagation(); onEdit(); }} aria-label={`Edit ${title}`}>
              <FiEdit2 />
            </button>
            {onDownload && (
              <button type="button" className="flex h-8 w-8 items-center justify-center text-[#144229]" onClick={(event) => { event.stopPropagation(); onDownload(); }} aria-label={`Download ${title}`}>
                <FiDownload />
              </button>
            )}
          </div>
        ),
        children: <div className="p-1">{children}</div>,
      }]}
    />
  );
}

export function TextGrid({
  labels,
  editable,
  textareaLabels = [],
  dateLabels = [],
}: {
  labels: string[];
  editable: boolean;
  textareaLabels?: string[];
  dateLabels?: string[];
}) {
  return (
    <div className="text-grid">
      {labels.map((label, index) => (
        <label key={`${label}-${index}`}>
          <span>{label}</span>
          {dateLabels.includes(label) ? (
            <DatePicker
              disabled={!editable}
              className="assessment-date-picker mx-1! h-10! w-[calc(100%-0.5rem)]! rounded-md! border-[#c1c9c0]! bg-white! px-3! [&.ant-picker-disabled]:bg-[#f4f4f0]!"
              format="DD/MM/YYYY"
            />
          ) : textareaLabels.includes(label) ? (
            <textarea
              disabled={!editable}
              className="min-h-16! resize-y! border-0! bg-white! p-3! disabled:bg-[#f4f4f0]!"
            />
          ) : (
            <input
              disabled={!editable}
              className="bg-white! disabled:bg-[#f4f4f0]!"
            />
          )}
        </label>
      ))}
    </div>
  );
}

export function RepeatSection({ id, title, labels }: { id: string; title: string; labels: string[] }) {
  const [rows, setRows] = React.useState([1]);
  const [open, setOpen] = React.useState(true);
  const responsiveColumns = title === "Plans" || title === "Remediation & Improvement";
  return (
    <div id={id}>
      <Collapse
        className="mt-5! overflow-hidden rounded-lg border border-[#c1c9c0] bg-white [&_.ant-collapse-header]:items-center! [&_.ant-collapse-header]:py-4! [&_.ant-collapse-header-text]:text-[#144229]!"
        activeKey={open ? ["section"] : []}
        onChange={() => setOpen((value) => !value)}
        items={[{
          key: "section",
          label: <strong>{title}</strong>,
          extra: <button type="button" className="flex h-8 w-8 items-center justify-center text-[#144229]" onClick={(event) => event.stopPropagation()} aria-label="Edit section"><FiEdit2 /></button>,
          children: (
            <div className="p-1">
              <div className="overflow-x-auto border border-[#c1c9c0]">
                {rows.map((row) => (
                  <div key={row}>
                    <div className="flex items-center justify-between border-b border-[#c1c9c0] bg-[#bceecb] px-3 py-2 text-sm font-bold text-[#144229]"><span>Section {row}</span>{row > 1 && <button type="button" className="rounded p-1.5 text-[#9b3022]! hover:bg-white" onClick={() => setRows((items) => items.filter((item) => item !== row))} aria-label={`Delete section ${row}`}><FiTrash2 className="h-4 w-4" /></button>}</div>
                    <div className={`grid border-b border-[#c1c9c0] last:border-b-0 ${responsiveColumns ? `grid-cols-1 ${title === "Plans" ? "sm:grid-cols-4" : "sm:grid-cols-4"}` : "grid-cols-3"}`}>
                      {labels.map((label) => <label key={label} className="flex min-w-0 flex-col gap-2 border-r border-[#c1c9c0] last:border-r-0"><span className="bg-[#f4f4f0] px-2 py-2 font-bold text-[#144229]">{label}</span>{label.toLowerCase().includes("date") ? <DatePicker className="repeat-date-picker mx-1! h-10! w-[calc(100%-0.5rem)]! max-w-full! px-3!" format="DD/MM/YYYY" /> : <textarea className="min-h-18.5! w-full! resize-y! border-0! p-3!" />}</label>)}
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="mt-3 inline-flex items-center gap-2 rounded-md border-0 bg-[#24593f] px-4 py-2.5 font-bold text-white" onClick={() => setRows((items) => [...items, items.length + 1])}><FiPlus /> Add {title.startsWith("Plans") ? "plan" : "section"}</button>
            </div>
          ),
        }]}
      />
    </div>
  );
}
