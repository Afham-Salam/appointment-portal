"use client";

import Link from "next/link";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiUser,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { DataTable, Column } from "@/components/DataTable";

const stats: {
  label: string;
  value: number;
  icon: IconType;
  hint?: string;
}[] = [
  { label: "Total Appointments", value: 128, icon: FiCalendar },
  {
    label: "Draft Appointments",
    value: 14,
    icon: FiEdit3,
    hint: "Waiting for approval",
  },
  { label: "Confirmed Appointments", value: 96, icon: FiCheckCircle },
  { label: "Today's Appointments", value: 12, icon: FiClock },
  { label: "Total Clients", value: 248, icon: FiUsers },
  { label: "Student Clients", value: 86, icon: FiUserCheck },
  { label: "Normal Clients", value: 162, icon: FiUser },
];

const appointments = [
  {
    patient: "Amelia Carter",
    type: "General consultation",
    time: "09:30 AM",
    status: "Confirmed",
  },
  {
    patient: "Noah Williams",
    type: "Follow-up visit",
    time: "11:00 AM",
    status: "Pending",
  },
  {
    patient: "Olivia Brown",
    type: "Annual check-up",
    time: "01:30 PM",
    status: "Confirmed",
  },
];

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <div className="page-heading flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p>Here is what is happening with your practice today.</p>
        </div>

        <p className="m-0 text-sm font-semibold text-[#414942]">{today}</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, hint }) => (
          <article
            key={label}
            className="rounded-md border border-[#c1c9c0] bg-white p-5 shadow-[0_5px_20px_rgba(23,32,42,0.03)]"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <span className="text-sm font-medium text-[#414942]">{label}</span>
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#2D5A3F] text-[#ffffff]">
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="m-0  text-3xl font-semibold text-[#1a1c1a]">
              {value}
            </p>
            {/* {hint ? (
              <p className="mt-1.5 text-xs text-[#414942]">{hint}</p>
            ) : null} */}
          </article>
        ))}
      </div>

      <section className="content-card">
        <div className="flex items-center justify-between border-b border-[#c1c9c0] px-6 py-5">
          <h3 className="m-0 text-base font-semibold text-[#1a1c1a]">Latest appointments</h3>
          <Link className="rounded-md px-3 py-2 text-sm font-semibold text-[#144229] transition hover:bg-[#bceecb]" href="/appointments">View all</Link>
        </div>
        <AppointmentTable rows={appointments} />
      </section>
    </>
  );
}

export function AppointmentTable({
  rows,
}: {
  rows: { patient: string; type: string; time: string; status: string }[];
}) {
  const columns: Column<{ patient: string; type: string; time: string; status: string }>[] = [
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
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Link className="inline-flex rounded-md bg-[#bceecb] px-3 py-2 text-xs font-semibold text-[#144229]" href="/appointments">
          View Details
        </Link>
      ),
    },
  ];

  return <DataTable columns={columns} data={rows} pageSize={5} />;
}
