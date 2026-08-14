"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/DataTable";
import { FilterHeader } from "@/components/FilterHeader";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { Appointment } from "../appointments/page";
import { FiDownload } from "react-icons/fi";
import ReportDownloadModal from "@/components/ReportDownloadModal";

type ClientRow = {
  id: number;
  name: string;
  email: string;
  lastVisit: string;
  status: string;
  phone: string;
  clientType: string;
};

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

function appointmentsToClients(rows: Appointment[]): ClientRow[] {
  return rows
    .filter((row) => row.status === "Accepted")
    .map((row) => ({
      id: row.id,
      name: row.name,
      email: `${row.name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
      lastVisit: row.createdAt,
      status: "Active",
      phone: `${row.countryCode} ${row.phone}`.trim(),
      clientType: row.clientType,
    }));
}

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const [reportClient, setReportClient] = useState<ClientRow | null>(null);

  const openReportModal = (client: ClientRow) => {
    setReportClient(client);
  };

  useEffect(() => {
    const saved = localStorage.getItem("treasure-appointments");
    const rows: Appointment[] = saved ? JSON.parse(saved) : [];
    setClients(appointmentsToClients(rows));
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter((row) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !row.name.toLowerCase().includes(q) &&
          !row.email.toLowerCase().includes(q) &&
          !row.phone.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (selectedStatus !== "all" && row.status !== selectedStatus) {
        return false;
      }
      if (dateRange?.[0] && dateRange?.[1]) {
        const rowDate = dayjs(row.lastVisit, "MMM D, YYYY");
        if (
          rowDate.isBefore(dateRange[0].startOf("day")) ||
          rowDate.isAfter(dateRange[1].endOf("day"))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [clients, searchQuery, selectedStatus, dateRange]);

  const columns: Column<ClientRow>[] = [
    {
      title: "Sl No",
      key: "slNo",
      render: (_row, index) => index + 1,
    },
    {
      title: "Client",
      key: "name",
      render: (row) => (
        <span>
          <strong>{row.name}</strong>
          <small className="table-sub">{row.phone}</small>
        </span>
      ),
    },
    { title: "Email", key: "email" },
    { title: "Type", key: "clientType" },
    { title: "Last visit", key: "lastVisit" },
    {
      title: "Status",
      key: "status",
      render: (row) => (
        <span className={`status ${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (row) => (
        <div className="table-actions">
           <button
            type="button"
            className="view-button"
            onClick={() =>
              router.push(`/client/viewdetails?id=${row.id}&from=clients`)
            }
           >
             View Details
           </button>
           <button
             type="button"
             className="view-button"
             onClick={() => openReportModal(row)}
           >
             <FiDownload aria-hidden="true" /> Report
           </button>
        </div>
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
        searchPlaceholder="Search by name, email, or phone..."
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        statusOptions={STATUS_OPTIONS}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <section className="content-card">
        <DataTable columns={columns} data={filteredClients} pageSize={10} />
      </section>

      <ReportDownloadModal
        key={reportClient ? `${reportClient.name}-${reportClient.clientType}` : "empty"}
        client={reportClient}
        open={Boolean(reportClient)}
        onClose={() => setReportClient(null)}
      />
    </>
  );
}
