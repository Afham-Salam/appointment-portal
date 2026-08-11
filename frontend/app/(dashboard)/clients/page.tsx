"use client";

import { useState, useMemo } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { FilterHeader } from "@/components/FilterHeader";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

const allClients = [
  "Amelia Carter",
  "Noah Williams",
  "Olivia Brown",
  "Liam Davis",
  "Emma Wilson",
  "James Taylor",
].map((name, index) => ({
  id: index,
  name,
  email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
  lastVisit: `Aug ${index + 2}, 2026`,
  status: index === 4 ? "Inactive" : "Active",
}));

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const filteredClients = useMemo(() => {
    return allClients.filter((row) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!row.name.toLowerCase().includes(q) && !row.email.toLowerCase().includes(q))
          return false;
      }
      if (selectedStatus !== "all" && row.status !== selectedStatus) return false;
      if (dateRange?.[0] && dateRange?.[1]) {
        const rowDate = dayjs(row.lastVisit, "MMM DD, YYYY");
        if (rowDate.isBefore(dateRange[0].startOf("day")) || rowDate.isAfter(dateRange[1].endOf("day")))
          return false;
      }
      return true;
    });
  }, [searchQuery, selectedStatus, dateRange]);

  const columns: Column<(typeof allClients)[number]>[] = [
    {
      title: "Client",
      key: "name",
      render: (row) => (
        <span className="client-name">
          <span className="avatar small">{row.name[0]}</span>
          {row.name}
        </span>
      ),
    },
    { title: "Email", key: "email" },
    { title: "Last visit", key: "lastVisit" },
    {
      title: "Status",
      key: "status",
      render: (row) => (
        <span className={`status ${row.status.toLowerCase()}`}>{row.status}</span>
      ),
    },
  ];

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Clients</h1>
          <p>Keep track of your client relationships and care history.</p>
        </div>
      </div>

      <FilterHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name or email..."
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        statusOptions={STATUS_OPTIONS}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <section className="content-card">
        <DataTable columns={columns} data={filteredClients} pageSize={10} />
      </section>
    </>
  );
}
