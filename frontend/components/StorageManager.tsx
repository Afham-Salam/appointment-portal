"use client";

import { useEffect, useState } from "react";
import { DatePicker, Modal } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { FiDatabase, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { getStorageUsage, deleteDataBeforeDate } from "@/lib/actions/appointments";

export default function StorageManager() {
  const [used, setUsed] = useState(0);
  const [limit] = useState(500); // 500 MB free tier
  const [loading, setLoading] = useState(true);
  const [deleteDate, setDeleteDate] = useState<Dayjs | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const fetchUsage = async () => {
    setLoading(true);
    const data = await getStorageUsage();
    if (!data.error) setUsed(data.used);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  const percentage = Math.min((used / limit) * 100, 100);
  const barColor =
    percentage > 80 ? "#dc2626" : percentage > 50 ? "#f59e0b" : "#2D5A3F";

  const handleDelete = async () => {
    if (!deleteDate) return;
    setDeleting(true);
    const res = await deleteDataBeforeDate(deleteDate.format("YYYY-MM-DD"));
    setDeleting(false);
    setConfirmOpen(false);

    if (res.error) {
      setResult(`Error: ${res.error}`);
    } else {
      setResult(`Deleted ${res.deleted} appointment(s) and related data.`);
      setDeleteDate(null);
      fetchUsage();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Storage Meter */}
      <div className="rounded-lg border border-[#c1c9c0] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#2D5A3F] text-white">
            <FiDatabase className="h-5 w-5" />
          </span>
          <div>
            <h3 className="m-0 text-base font-semibold text-[#1a1c1a]">
              Database Storage
            </h3>
            <p className="m-0 text-sm text-[#414942]">
              Supabase free tier — 500 MB limit
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-[#414942]">Loading usage...</p>
        ) : (
          <>
            <div className="mb-2 flex items-end justify-between">
              <span className="text-2xl font-bold text-[#1a1c1a]">
                {used} MB
              </span>
              <span className="text-sm text-[#414942]">
                of {limit} MB ({percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%`, backgroundColor: barColor }}
              />
            </div>
            {percentage > 80 && (
              <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-600">
                <FiAlertTriangle className="h-4 w-4" />
                Storage running low — consider cleaning old data
              </p>
            )}
          </>
        )}
      </div>

      {/* Data Cleanup */}
      <div className="rounded-lg border border-[#c1c9c0] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-red-50 text-red-600">
            <FiTrash2 className="h-5 w-5" />
          </span>
          <div>
            <h3 className="m-0 text-base font-semibold text-[#1a1c1a]">
              Clean Old Data
            </h3>
            <p className="m-0 text-sm text-[#414942]">
              Delete all appointments and related forms before a specific date
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[#144229]">
              Delete data before
            </label>
            <DatePicker
              format="DD/MM/YYYY"
              value={deleteDate}
              onChange={setDeleteDate}
              disabledDate={(current) =>
                current && current > dayjs().subtract(30, "day")
              }
              placeholder="Select cutoff date"
              className="h-11! w-64!"
            />
            <span className="text-xs text-[#414942]">
              Only dates older than 30 days can be selected
            </span>
          </div>

          <button
            type="button"
            disabled={!deleteDate || deleting}
            onClick={() => setConfirmOpen(true)}
            className="flex h-11 cursor-pointer items-center gap-2 rounded-md bg-red-600 px-5 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiTrash2 className="h-4 w-4" />
            Delete Old Data
          </button>
        </div>

        {result && (
          <p
            className={`mt-4 rounded-md px-4 py-3 text-sm ${
              result.startsWith("Error")
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-700"
            }`}
          >
            {result}
          </p>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        title={
          <span className="flex items-center gap-2 text-red-600">
            <FiAlertTriangle /> Confirm Deletion
          </span>
        }
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onOk={handleDelete}
        okText={deleting ? "Deleting..." : "Yes, Delete"}
        okButtonProps={{
          danger: true,
          disabled: deleting,
          className: "h-11! font-semibold!",
        }}
        cancelButtonProps={{ className: "h-11!" }}
      >
        <p className="text-sm text-[#414942]">
          This will permanently delete all appointments and their related data
          (forms, assessments, remediation entries) created before{" "}
          <strong>
            {deleteDate?.format("DD MMM YYYY")}
          </strong>
          .
        </p>
        <p className="mt-2 text-sm font-semibold text-red-600">
          This action cannot be undone.
        </p>
        <p className="mt-2 text-sm text-[#414942]">
          Clients who have newer appointments will be kept. Only clients with no
          remaining appointments will be removed.
        </p>
      </Modal>
    </div>
  );
}