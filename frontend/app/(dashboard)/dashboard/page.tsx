"use client";

import { useEffect, useState } from "react";
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
import { DataTable, type Column } from "@/components/DataTable";
import { getDashboardStats, getLatestAppointments } from "@/lib/actions/appointments";
import { useRole } from "@/components/RoleContext";

type StatCard = {
  label: string;
  value: number;
  icon: IconType;
};

type AppointmentRow = {
  id: string;
  patient: string;
  type: string;
  date: string;
  status: string;
  clientId: string;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const role = useRole();
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
    const [statsData, aptsData] = await Promise.all([
  getDashboardStats(),
  getLatestAppointments(5),
]);

      setStats([
        { label: "Total Appointments", value: statsData.totalAppointments, icon: FiCalendar },
        { label: "Pending Appointments", value: statsData.pendingAppointments, icon: FiEdit3 },
        { label: "Accepted Appointments", value: statsData.acceptedAppointments, icon: FiCheckCircle },
        { label: "Today's Appointments", value: statsData.todayAppointments, icon: FiClock },
        { label: "Total Clients", value: statsData.totalClients, icon: FiUsers },
        { label: "Student Clients", value: statsData.studentClients, icon: FiUserCheck },
        { label: "Regular Clients", value: statsData.normalClients, icon: FiUser },
      ]);

      setAppointments(aptsData.appointments || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const columns: Column<AppointmentRow>[] = [
    { title: "Client", key: "patient" },
    { title: "Type", key: "type" },
    { title: "Date", key: "date" },
    {
      title: "Status",
      key: "status",
      render: (row) => (
        <span className={`status ${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      ),
    },
     ...(role === "admin"
      ? [
          {
            title: "Actions",
            key: "actions",
            render: (row: AppointmentRow) => (
              <Link
                className="inline-flex rounded-md bg-[#bceecb] px-3 py-2 text-xs font-semibold text-[#144229]"
                href={
                  row.status === "Accepted"
                    ? `/client/viewdetails?id=${row.clientId}`
                    : "/appointments"
                }
              >
                {row.status === "Accepted" ? "View Details" : "View"}
              </Link>
            ),
          },
        ]
      : []),
  ];

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
        {loading
          ? Array.from({ length: 7 }).map((_, i) => (
              <article
                key={i}
                className="animate-pulse rounded-md border border-[#c1c9c0] bg-white p-5 shadow-[0_5px_20px_rgba(23,32,42,0.03)]"
              >
                <div className="mb-4 h-5 w-32 rounded bg-gray-100" />
                <div className="h-9 w-16 rounded bg-gray-100" />
              </article>
            ))
          : stats.map(({ label, value, icon: Icon }) => (
              <article
                key={label}
                className="rounded-md border border-[#c1c9c0] bg-white p-5 shadow-[0_5px_20px_rgba(23,32,42,0.03)]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="text-sm font-medium text-[#414942]">
                    {label}
                  </span>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#2D5A3F] text-[#ffffff]">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <p className="m-0 text-3xl font-semibold text-[#1a1c1a]">
                  {value}
                </p>
              </article>
            ))}
      </div>

      <section className="content-card">
        <div className="flex items-center justify-between border-b border-[#c1c9c0] px-6 py-5">
          <h3 className="m-0 text-base font-semibold text-[#1a1c1a]">
            Latest appointments
          </h3>
          <Link
            className="rounded-md px-3 py-2 text-sm font-semibold text-[#144229] transition hover:bg-[#bceecb]"
            href="/appointments"
          >
            View all
          </Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-[#414942]">
            Loading...
          </div>
        ) : (
          <DataTable columns={columns} data={appointments} pageSize={5} />
        )}
      </section>
    </>
  );
}