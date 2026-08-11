"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/DataTable";
import { FilterHeader } from "@/components/FilterHeader";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

const initialRows = [
  "Amelia Carter",
  "Noah Williams",
  "Olivia Brown",
  "Liam Davis",
  "Emma Wilson",
].map((patient, index) => ({
  id: index,
  patient,
  type: ["General consultation", "Follow-up visit", "Annual check-up"][index % 3],
  time: `Aug ${10 + index}, 2026`,
  status: index === 1 ? "Pending" : "Confirmed",
}));

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Pending", label: "Pending" },
];

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const filteredRows = useMemo(() => {
    return initialRows.filter((row) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !row.patient.toLowerCase().includes(q) &&
          !row.type.toLowerCase().includes(q) &&
          !row.status.toLowerCase().includes(q)
        )
          return false;
      }
      if (selectedStatus !== "all" && row.status !== selectedStatus) return false;
      if (dateRange?.[0] && dateRange?.[1]) {
        const rowDate = dayjs(row.time, "MMM DD, YYYY");
        if (rowDate.isBefore(dateRange[0].startOf("day")) || rowDate.isAfter(dateRange[1].endOf("day")))
          return false;
      }
      return true;
    });
  }, [searchQuery, selectedStatus, dateRange]);

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Latest appointments</h1>
          <p>Review and manage your upcoming schedule.</p>
        </div>
      </div>

      <FilterHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name, type, or status..."
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        statusOptions={STATUS_OPTIONS}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <section className="content-card">
        <DataTable
          columns={[
            { title: "Client", key: "patient" },
            { title: "Appointment", key: "type" },
            { title: "Time", key: "time" },
            {
              title: "Status",
              key: "status",
              render: (row) => (
                <span className={`status ${row.status.toLowerCase()}`}>
                  {row.status}
                </span>
              ),
            },
          ]}
          data={filteredRows}
          pageSize={10}
        />
      </section>
    </>
  );
}
