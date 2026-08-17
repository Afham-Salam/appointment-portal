"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/DataTable";
import { FilterHeader } from "@/components/FilterHeader";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { getApprovedClients } from "@/lib/actions/appointments";

type ClientRow = {
  id: string;
  name: string;
  phone: string;
  countryCode: string;
  clientType: string;
  createdAt: string;
  totalAppointments: number;
  scheduledDate: string;
};

const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "Student", label: "Student" },
  { value: "Client", label: "Client" },
];

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([dayjs().startOf("day"), dayjs().endOf("day")]);

  useEffect(() => {
    async function fetch() {
      const { clients: data } = await getApprovedClients();
      setClients(
        data.map((c) => ({
          ...c,
          phone: `${c.countryCode} ${c.phone}`.trim(),
        }))
      );
      setLoading(false);
    }
    fetch();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter((row) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !row.name.toLowerCase().includes(q) &&
          !row.phone.toLowerCase().includes(q) &&
          !row.clientType.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (selectedType !== "all" && row.clientType !== selectedType) {
        return false;
      }
      if (dateRange?.[0] && dateRange?.[1]) {
        const rowDate = dayjs(row.scheduledDate || row.createdAt, [
          "YYYY-MM-DD",
          "MMM D, YYYY",
        ]);
        if (
          rowDate.isBefore(dateRange[0].startOf("day")) ||
          rowDate.isAfter(dateRange[1].endOf("day"))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [clients, searchQuery, selectedType, dateRange]);

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
    { title: "Type", key: "clientType" },
    {
      title: "Appointments",
      key: "totalAppointments",
      render: (row) => <span className="font-medium">{row.totalAppointments}</span>,
    },
    { title: "Joined", key: "createdAt" },
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
        searchPlaceholder="Search by name, phone, or type..."
        selectedStatus={selectedType}
        onStatusChange={setSelectedType}
        statusOptions={TYPE_OPTIONS}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <section className="content-card">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-[#414942]">
            Loading clients...
          </div>
        ) : (
          <DataTable columns={columns} data={filteredClients} pageSize={10} />
        )}
      </section>
    </>
  );
}