"use client";

import type { ReactNode } from "react";
import * as React from "react";
import { Collapse, DatePicker } from "antd";
import { FiDownload, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import dayjs from "dayjs";
import {
  addRemediationEntry,
  updateRemediationEntry,
  deleteRemediationEntry,
} from "@/lib/actions/appointments";

/* ─── Field ─── */
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

/* ─── FormSection (with Save / Cancel when editing) ─── */
export function FormSection({
  title,
  children,
  open,
  onToggle,
  editing,
  onEdit,
  onSave,
  saving,
  onDownload,
}: {
  title: string;
  children: ReactNode;
  open: boolean;
  onToggle: () => void;
  editing: boolean;
  onEdit: () => void;
  onSave?: () => void;
  saving?: boolean;
  onDownload?: () => void;
}) {
  return (
    <Collapse
      className="mt-5! overflow-hidden rounded-lg border border-[#c1c9c0] bg-white [&_.ant-collapse-header]:items-center! [&_.ant-collapse-header]:py-4! [&_.ant-collapse-header-text]:text-[#144229]!"
      activeKey={open ? ["section"] : []}
      onChange={onToggle}
      items={[
        {
          key: "section",
          label: <strong>{title}</strong>,
          extra: (
            <div className="flex items-center gap-1">
              {editing ? (
                <>
                  <button
                    type="button"
                    className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md bg-[#2D5A3F] px-3 text-xs font-bold text-white disabled:opacity-50"
                    disabled={saving}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSave?.();
                    }}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-[#c1c9c0] px-3 text-xs font-bold text-[#414942]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center text-[#144229]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  aria-label={`Edit ${title}`}
                >
                  <FiEdit2 />
                </button>
              )}
              {onDownload && !editing && (
                <button
                  type="button"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center text-[#144229]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload();
                  }}
                  aria-label={`Download ${title}`}
                >
                  <FiDownload />
                </button>
              )}
            </div>
          ),
          children: <div className="p-1">{children}</div>,
        },
      ]}
    />
  );
}

/* ─── TextGrid (stateful — captures values, accepts initial data) ─── */
export function TextGrid({
  labels,
  editable,
  values,
  onChange,
}: {
  labels: string[];
  editable: boolean;
  values?: Record<string, string>;
  onChange?: (values: Record<string, string>) => void;
}) {
  const handleChange = (key: string, value: string) => {
    onChange?.({ ...values, [key]: value });
  };

  return (
    <div className="text-grid">
      {labels.map((label, index) => {
        const key = labelToKey(label, index);
        return (
          <label key={`${label}-${index}`}>
            <span>{label}</span>
            <input
              disabled={!editable}
              value={values?.[key] || ""}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </label>
        );
      })}
    </div>
  );
}

// Convert label to a consistent key for storing values
function labelToKey(label: string, index: number): string {
  return `${label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${index}`;
}

// Helper to convert label array to key array (for mapping DB fields)
export function labelsToKeys(labels: string[]): string[] {
  return labels.map((label, index) => labelToKey(label, index));
}

/* ─── RepeatSection (Supabase-wired, shared by Student & Client) ─── */
export type RemediationRow = {
  id?: string;
  entry_date: string;
  remediation_given: string;
  improvement_seen: string;
  sort_order: number;
  isNew?: boolean;
};

export function RepeatSection({
  id,
  title,
  labels,
  clientId,
  initialEntries,
  onEntriesChange,
}: {
  id: string;
  title: string;
  labels: string[];
  clientId: string;
  initialEntries?: RemediationRow[];
  onEntriesChange?: () => void;
}) {
  const [rows, setRows] = React.useState<RemediationRow[]>(
    initialEntries && initialEntries.length > 0
      ? initialEntries
      : [
          {
            entry_date: "",
            remediation_given: "",
            improvement_seen: "",
            sort_order: 0,
            isNew: true,
          },
        ],
  );
  const [open, setOpen] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  // Update rows when initialEntries change
  React.useEffect(() => {
    if (initialEntries && initialEntries.length > 0) {
      setRows(initialEntries);
    }
  }, [initialEntries]);

  const updateRow = (index: number, field: string, value: string) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        entry_date: "",
        remediation_given: "",
        improvement_seen: "",
        sort_order: prev.length,
        isNew: true,
      },
    ]);
  };

  const handleDeleteRow = async (index: number) => {
    const row = rows[index];
    if (row.id) {
      await deleteRemediationEntry(row.id);
      onEntriesChange?.();
    }
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveRow = async (index: number) => {
    const row = rows[index];
    setSaving(true);

    if (row.id) {
      await updateRemediationEntry(row.id, {
        entry_date: row.entry_date || undefined,
        remediation_given: row.remediation_given,
        improvement_seen: row.improvement_seen,
      });
    } else {
      const result = await addRemediationEntry(clientId, {
        entry_date: row.entry_date || undefined,
        remediation_given: row.remediation_given,
        improvement_seen: row.improvement_seen,
        sort_order: row.sort_order,
      });
      if (result.id) {
        setRows((prev) =>
          prev.map((r, i) =>
            i === index ? { ...r, id: result.id, isNew: false } : r,
          ),
        );
      }
    }

    setSaving(false);
    onEntriesChange?.();
  };

  return (
    <div id={id}>
      <Collapse
        className="mt-5! overflow-hidden rounded-lg border border-[#c1c9c0] bg-white [&_.ant-collapse-header]:items-center! [&_.ant-collapse-header]:py-4! [&_.ant-collapse-header-text]:text-[#144229]!"
        activeKey={open ? ["section"] : []}
        onChange={() => setOpen((v) => !v)}
        items={[
          {
            key: "section",
            label: <strong>{title}</strong>,
            children: (
              <div className="p-1">
                <div className="overflow-x-auto border border-[#c1c9c0]">
                  {rows.map((row, index) => (
                    <div key={row.id || `new-${index}`}>
                      <div className="flex items-center justify-between border-b border-[#c1c9c0] bg-[#bceecb] px-3 py-2 text-sm font-bold text-[#144229]">
                        <span>Session {index + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="cursor-pointer rounded bg-[#2D5A3F] px-2.5 py-1 text-xs font-bold text-white disabled:opacity-50"
                            disabled={saving}
                            onClick={() => handleSaveRow(index)}
                          >
                            {saving ? "..." : row.id ? "Update" : "Save"}
                          </button>
                          {(index > 0 || rows.length > 1) && (
                            <button
                              type="button"
                              className="cursor-pointer rounded p-1.5 text-[#9b3022]! hover:bg-white"
                              onClick={() => handleDeleteRow(index)}
                              aria-label={`Delete session ${index + 1}`}
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="grid min-w-170 grid-cols-3 border-b border-[#c1c9c0] last:border-b-0">
                        {/* Date */}
                        <label className="flex min-w-0 flex-col gap-2 border-r border-[#c1c9c0]">
                          <span className="bg-[#f4f4f0] px-2 py-2 font-bold text-[#144229]">
                            Date
                          </span>
                          <DatePicker
                            className="repeat-date-picker mx-1! h-10! w-[calc(100%-0.5rem)]! max-w-full! px-3!"
                            format="DD/MM/YYYY"
                            value={
                              row.entry_date
                                ? dayjs(row.entry_date)
                                : undefined
                            }
                            onChange={(date) =>
                              updateRow(
                                index,
                                "entry_date",
                                date ? date.format("YYYY-MM-DD") : "",
                              )
                            }
                          />
                        </label>
                        {/* Remediation given */}
                        <label className="flex min-w-0 flex-col gap-2 border-r border-[#c1c9c0]">
                          <span className="bg-[#f4f4f0] px-2 py-2 font-bold text-[#144229]">
                            {labels[1] || "Remediation given"}
                          </span>
                          <textarea
                            className="min-h-18.5! w-full! resize-y! border-0! p-3!"
                            value={row.remediation_given}
                            onChange={(e) =>
                              updateRow(
                                index,
                                "remediation_given",
                                e.target.value,
                              )
                            }
                          />
                        </label>
                        {/* Improvement seen */}
                        <label className="flex min-w-0 flex-col gap-2">
                          <span className="bg-[#f4f4f0] px-2 py-2 font-bold text-[#144229]">
                            {labels[2] || "Improvement seen"}
                          </span>
                          <textarea
                            className="min-h-18.5! w-full! resize-y! border-0! p-3!"
                            value={row.improvement_seen}
                            onChange={(e) =>
                              updateRow(
                                index,
                                "improvement_seen",
                                e.target.value,
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-md border-0 bg-[#24593f] px-4 py-2.5 font-bold text-white"
                  onClick={handleAddRow}
                >
                  <FiPlus /> Add Session
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}