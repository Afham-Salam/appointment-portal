"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { FilterHeader } from "@/components/ui/FilterHeader";
import type { Dayjs } from "dayjs";
import { getApprovedClients } from "@/lib/actions/appointments";
import {
  FiCheckSquare,
  FiCreditCard,
  FiDownload,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import AppointmentNotifyModal from "@/components/appointment/AppointmentNotifyModal";
import {
  toNotifyDetails,
  type AppointmentNotifyDetails,
} from "@/components/appointment/AppointmentConfirmationPdf";
import ReportDownloadModal from "@/components/clientDetails/ReportDownloadModal";
import ClientPaymentModal, {
  type ClientPaymentConfig,
} from "@/components/clientDetails/ClientPaymentModal";
import StudentAttendanceModal, {
  type StudentAttendanceRecord,
} from "@/components/students/StudentAttendanceModal";

type StudentRow = {
  id: string;
  name: string;
  phone: string;
  countryCode: string;
  clientType: string;
  createdAt: string;
  age: string;
  totalAppointments: number;
  scheduledDate: string;
  scheduledTime: string;
};

const ATTENDANCE_FILTER_OPTIONS = [
  { value: "all", label: "All Students" },
  { value: "marked", label: "Attendance Marked" },
  { value: "unmarked", label: "Not Marked Yet" },
];

const SAMPLE_STUDENTS: StudentRow[] = [
  {
    id: "sample-student-1",
    name: "Aisha Rahman",
    phone: "+91 98470 11223",
    countryCode: "+91",
    clientType: "Student",
    createdAt: "Oct 10, 2026",
    age: "12",
    totalAppointments: 4,
    scheduledDate: "2026-10-24",
    scheduledTime: "10:30",
  },
  {
    id: "sample-student-2",
    name: "Mohammed Farhan",
    phone: "+91 97450 88991",
    countryCode: "+91",
    clientType: "Student",
    createdAt: "Oct 14, 2026",
    age: "15",
    totalAppointments: 2,
    scheduledDate: "2026-10-25",
    scheduledTime: "14:00",
  },
  {
    id: "sample-student-3",
    name: "Neha Krishnan",
    phone: "+91 94471 55320",
    countryCode: "+91",
    clientType: "Student",
    createdAt: "Oct 18, 2026",
    age: "10",
    totalAppointments: 1,
    scheduledDate: "2026-10-26",
    scheduledTime: "11:15",
  },
  {
    id: "sample-student-4",
    name: "Adithya Menon",
    phone: "+91 99952 44110",
    countryCode: "+91",
    clientType: "Student",
    createdAt: "Oct 20, 2026",
    age: "14",
    totalAppointments: 3,
    scheduledDate: "2026-10-27",
    scheduledTime: "16:30",
  },
];

const INITIAL_ATTENDANCE: Record<string, StudentAttendanceRecord[]> = {
  "sample-student-1": [
    {
      id: "att-sample-103",
      attendanceNo: 3,
      date: "2026-10-24",
      paidAmount: 1000,
      paymentMethod: "UPI",
      notes: "Reading comprehension & phonics drill",
    },
    {
      id: "att-sample-102",
      attendanceNo: 2,
      date: "2026-10-18",
      paidAmount: 0,
      notes: "Memory & focus exercises",
    },
    {
      id: "att-sample-101",
      attendanceNo: 1,
      date: "2026-10-12",
      paidAmount: 1500,
      paymentMethod: "Cash",
      notes: "Initial student assessment & orientation",
    },
  ],
  "sample-student-2": [
    {
      id: "att-sample-201",
      attendanceNo: 1,
      date: "2026-10-21",
      paidAmount: 1200,
      paymentMethod: "Cash",
      notes: "Baseline evaluation session",
    },
  ],
  "sample-student-4": [
    {
      id: "att-sample-402",
      attendanceNo: 2,
      date: "2026-10-23",
      paidAmount: 800,
      paymentMethod: "UPI",
      notes: "Remediation follow-up",
    },
    {
      id: "att-sample-401",
      attendanceNo: 1,
      date: "2026-10-16",
      paidAmount: 1200,
      paymentMethod: "Bank transfer",
      notes: "First remediation session",
    },
  ],
};

const INITIAL_PAYMENTS: Record<string, ClientPaymentConfig> = {
  "sample-student-1": {
    totalAmount: 6000,
    notes: "6-session student remediation package",
    payments: [
      {
        id: "pay-sample-1",
        date: "2026-10-12",
        amount: 1500,
        category: "Student assessment",
        payment_method: "Cash",
        reference: "RCP-1041",
        notes: "Initial installment",
      },
      {
        id: "pay-sample-2",
        date: "2026-10-24",
        amount: 1000,
        category: "Session fee",
        payment_method: "UPI",
        reference: "UPI-883421",
        notes: "3rd session payment",
      },
    ],
  },
  "sample-student-2": {
    totalAmount: 4500,
    notes: "Student counselling & study skill package",
    payments: [
      {
        id: "pay-sample-3",
        date: "2026-10-21",
        amount: 1200,
        category: "Session fee",
        payment_method: "Cash",
        reference: "RCP-1052",
        notes: "First session",
      },
    ],
  },
};

const rupee = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  const [reportStudent, setReportStudent] = useState<StudentRow | null>(null);
  const [paymentStudent, setPaymentStudent] = useState<StudentRow | null>(null);
  const [attendanceStudent, setAttendanceStudent] =
    useState<StudentRow | null>(null);
  const [notifyDetails, setNotifyDetails] =
    useState<AppointmentNotifyDetails | null>(null);

  const [paymentConfigs, setPaymentConfigs] = useState<
    Record<string, ClientPaymentConfig>
  >(INITIAL_PAYMENTS);
  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<string, StudentAttendanceRecord[]>
  >(INITIAL_ATTENDANCE);

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      try {
        const { clients: data, total: count } = await getApprovedClients({
          page,
          pageSize,
          search: searchQuery || undefined,
          clientType: "Student",
          dateFrom: dateRange?.[0]?.format("YYYY-MM-DD") || undefined,
          dateTo: dateRange?.[1]?.format("YYYY-MM-DD") || undefined,
        });
        const mapped = data.map((c) => ({
          ...c,
          age: c.age || "—",
          phone: `${c.countryCode} ${c.phone}`.trim(),
        }));
        const merged = [...SAMPLE_STUDENTS, ...mapped];
        setStudents(merged);
        setTotal(count + SAMPLE_STUDENTS.length);
      } catch {
        setStudents(SAMPLE_STUDENTS);
        setTotal(SAMPLE_STUDENTS.length);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, [page, searchQuery, dateRange]);

  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const visibleStudents = students.filter((student) => {
    const count = attendanceRecords[student.id]?.length || 0;
    if (attendanceFilter === "marked") return count > 0;
    if (attendanceFilter === "unmarked") return count === 0;
    return true;
  });

  const columns: Column<StudentRow>[] = [
    {
      title: "Sl No",
      key: "slNo",
      render: (_row, index) => index + 1,
    },
    {
      title: "Student",
      key: "name",
      className: "min-w-[100px]",
      render: (row) => (
        <span className="block min-w-[100px]">
          <strong className="whitespace-nowrap">{row.name}</strong>
          <small className="table-sub whitespace-nowrap">{row.phone}</small>
        </span>
      ),
    },
    {
      title: "Age",
      key: "age",
      render: (row) => (
        <span className="font-semibold text-[#144229]">{row.age || "—"}</span>
      ),
    },
    {
      title: "Appointments",
      key: "totalAppointments",
      render: (row) => (
        <span className="font-semibold text-[#1a1c1a]">{row.totalAppointments}</span>
      ),
    },
    {
      title: "Attendance",
      key: "attendance",
      render: (row) => {
        const list = attendanceRecords[row.id] || [];
        return list.length > 0 ? (
          <span className="inline-flex items-center rounded bg-[#bceecb] px-1.5 py-0.5 text-[11px] font-semibold leading-4 text-[#144229]">
            {list.length} marked
          </span>
        ) : (
          <span className="inline-flex items-center rounded bg-[#fff0c6] px-1.5 py-0.5 text-[11px] font-semibold leading-4 text-[#775a19]">
            Not marked
          </span>
        );
      },
    },
    {
      title: "Payment Status",
      key: "payment",
      render: (row) => {
        const cfg = paymentConfigs[row.id];
        const sessionPaid = (attendanceRecords[row.id] || []).reduce(
          (sum, r) => sum + (r.paidAmount || 0),
          0,
        );
        const configPaid = (cfg?.payments || []).reduce(
          (sum, p) => sum + p.amount,
          0,
        );
        const totalPaid = sessionPaid + configPaid;

        if (!cfg && totalPaid === 0) {
          return <span className="text-xs text-[#667362]">Not configured</span>;
        }

        const totalFee = cfg?.totalAmount || 0;
        const balance = Math.max(totalFee - totalPaid, 0);

        return (
          <div className="flex min-w-28 flex-col gap-1 text-[11px] leading-4">
            <span className="inline-flex items-center justify-between gap-2 rounded-md bg-[#e8f7ee] px-2 py-1 font-bold text-[#144229]">
              <span className="font-semibold uppercase tracking-wide text-[#2D5A3F]">Paid</span>
              {rupee(totalPaid)}
            </span>
            <span className="inline-flex items-center justify-between gap-2 rounded-md bg-[#eef1ec] px-2 py-1 font-bold text-[#1a1c1a]">
              <span className="font-semibold uppercase tracking-wide text-[#536350]">Total</span>
              {rupee(totalFee)}
            </span>
            <span className={`inline-flex items-center justify-between gap-2 rounded-md px-2 py-1 font-bold ${
              balance === 0 ? "bg-[#bceecb] text-[#144229]" : "bg-[#fff0c6] text-[#775a19]"
            }`}>
              <span className="font-semibold uppercase tracking-wide">Bal</span>
              {rupee(balance)}
            </span>
          </div>
        );
      },
    },
    { title: "Joined", key: "createdAt" },
    {
      title: "Appointment",
      key: "scheduledDate",
      render: (row) => {
        if (!row.scheduledDate) return "—";
        const date = new Date(row.scheduledDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        if (!row.scheduledTime) return date;

        const [h, m] = row.scheduledTime.split(":");
        const hour = parseInt(h);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${date}, ${hour12}:${m} ${ampm}`;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (row) => {
        const count = attendanceRecords[row.id]?.length || 0;
        return (
          <div className="table-actions">
            <button
              type="button"
              className="view-button"
              onClick={() =>
                router.push(`/client/viewdetails?id=${row.id}&from=students`)
              }
            >
              View Details
            </button>

            <button
              type="button"
              className="cursor-pointer inline-flex h-[34px] items-center gap-1.5 whitespace-nowrap rounded-[5px] border border-[#25D366] bg-[#25D366] px-3 text-xs font-bold text-white hover:bg-[#1ebe5d]"
              title="Notify on WhatsApp"
              aria-label={`Notify ${row.name} on WhatsApp`}
              onClick={() => setNotifyDetails(toNotifyDetails(row))}
            >
              <FaWhatsapp aria-hidden="true" />
              Notify
            </button>

            <button
              type="button"
              className="cursor-pointer inline-flex h-[34px] items-center gap-1.5 whitespace-nowrap rounded-[5px] bg-[#2D5A3F] px-3 text-xs font-bold text-white hover:bg-[#16482b]"
              onClick={() => setAttendanceStudent(row)}
            >
              <FiCheckSquare aria-hidden="true" />
              {count > 0 ? `Attendance (${count})` : "Mark Attendance"}
            </button>

            <button
              type="button"
              className="cursor-pointer inline-flex h-[34px] items-center gap-1.5 whitespace-nowrap rounded-[5px] border border-[#2d5a3f] bg-white px-3 text-xs font-bold text-[#144229] hover:bg-[#e8f7ee]"
              onClick={() => setPaymentStudent(row)}
            >
              <FiCreditCard aria-hidden="true" />
              {paymentConfigs[row.id] ? "View History" : "Set Payment"}
            </button>

            <button
              type="button"
              className="reportbtn"
              onClick={() => setReportStudent(row)}
            >
              <FiDownload aria-hidden="true" /> Report
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Students</h1>
          <p>
            Manage student sessions, digital attendance signatures, and fee
            payments.
          </p>
        </div>
      </div>

      <FilterHeader
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Search student by name or phone"
        selectedStatus={attendanceFilter}
        onStatusChange={(val) => {
          setAttendanceFilter(val);
          setPage(1);
        }}
        statusOptions={ATTENDANCE_FILTER_OPTIONS}
        dateRange={dateRange}
        onDateRangeChange={(val) => {
          setDateRange(val);
          setPage(1);
        }}
      />

      <section className="content-card">
        <DataTable
          columns={columns}
          data={visibleStudents}
          loading={loading}
          pageSize={pageSize}
          total={total}
          currentPage={page}
          onPageChange={setPage}
        />
      </section>

      <AppointmentNotifyModal
        open={notifyDetails !== null}
        details={notifyDetails}
        onClose={() => setNotifyDetails(null)}
      />

      <StudentAttendanceModal
        open={Boolean(attendanceStudent)}
        student={attendanceStudent}
        records={
          attendanceStudent ? attendanceRecords[attendanceStudent.id] || [] : []
        }
        onClose={() => setAttendanceStudent(null)}
        onSaveRecord={(nextRecord) => {
          if (!attendanceStudent) return;
          setAttendanceRecords((prev) => ({
            ...prev,
            [attendanceStudent.id]: [
              nextRecord,
              ...(prev[attendanceStudent.id] || []),
            ],
          }));
        }}
      />

      <ClientPaymentModal
        open={Boolean(paymentStudent)}
        client={paymentStudent}
        config={paymentStudent ? paymentConfigs[paymentStudent.id] : undefined}
        onClose={() => setPaymentStudent(null)}
        onSaveConfig={(next) => {
          if (!paymentStudent) return;
          setPaymentConfigs((prev) => ({
            ...prev,
            [paymentStudent.id]: next,
          }));
        }}
      />

      <ReportDownloadModal
        key={
          reportStudent
            ? `${reportStudent.name}-${reportStudent.clientType}`
            : "empty"
        }
        client={reportStudent}
        open={Boolean(reportStudent)}
        onClose={() => setReportStudent(null)}
      />
    </>
  );
}
