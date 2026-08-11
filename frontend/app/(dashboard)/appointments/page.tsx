"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/DataTable";
import { FilterHeader } from "@/components/FilterHeader";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Collapse, DatePicker } from "antd";
import {
  FiArrowLeft,
  FiCheck,
  FiDownload,
  FiEdit2,
  FiPlus,
  FiPrinter,
  FiTrash2,
  FiX,
} from "react-icons/fi";

type Status = "Pending" | "Accepted" | "Rejected";
type ClientType = "Student" | "Parent" | "Normal";
export type Appointment = {
  id: number;
  name: string;
  age: string;
  relative: string;
  address: string;
  countryCode: string;
  phone: string;
  clientType: ClientType;
  status: Status;
  createdAt: string;
};

const seed: Appointment[] = [
  {
    id: 1,
    name: "Amelia Carter",
    age: "28",
    relative: "",
    address: "",
    countryCode: "+91",
    phone: "9061200099",
    clientType: "Normal",
    status: "Accepted",
    createdAt: "Aug 10, 2026",
  },
  {
    id: 2,
    name: "Noah Williams",
    age: "14",
    relative: "David Williams",
    address: "",
    countryCode: "+91",
    phone: "7306941801",
    clientType: "Student",
    status: "Pending",
    createdAt: "Aug 11, 2026",
  },
];

const blank = {
  name: "",
  age: "",
  relative: "",
  address: "",
  countryCode: "+91",
  phone: "",
  clientType: "Student" as ClientType,
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
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
        onChange={(e) => onChange?.(e.target.value)}
      />
    </label>
  );
}

function FormSection({
  title,
  children,
  open,
  onToggle,
  onEdit,
  onDownload,
}: {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  editable?: boolean;
  onEdit: () => void;
  onDownload?: () => void;
}) {
  return <Collapse
    className="!mt-5 overflow-hidden rounded-lg border border-[#c1c9c0] bg-white [&_.ant-collapse-header]:!items-center [&_.ant-collapse-header]:!py-4 [&_.ant-collapse-header-text]:!text-[#144229]"
    activeKey={open ? ["section"] : []}
    onChange={onToggle}
    items={[{
      key: "section",
      label: <strong>{title}</strong>,
      extra: <div className="flex items-center gap-1"><button type="button" className="flex h-8 w-8 items-center justify-center text-[#144229]" onClick={(event) => { event.stopPropagation(); onEdit(); }} aria-label={`Edit ${title}`}><FiEdit2 /></button>{onDownload && <button type="button" className="flex h-8 w-8 items-center justify-center text-[#144229]" onClick={(event) => { event.stopPropagation(); onDownload(); }} aria-label="Download application PDF"><FiDownload /></button>}</div>,
      children: <div className="p-1">{children}</div>,
    }]}
  />;
}

function TextGrid({
  labels,
  editable,
}: {
  labels: string[];
  editable: boolean;
}) {
  return (
    <div className="text-grid">
      {labels.map((label) => (
        <label key={label}>
          <span>{label}</span>
          <input disabled={!editable} />
        </label>
      ))}
    </div>
  );
}

export function ClientDetails({
  appointment,
  onBack,
}: {
  appointment: Appointment;
  onBack: () => void;
}) {
  const [data, setData] = useState(appointment);
  const [open, setOpen] = useState<string[]>([
    "Application Form",
    ...(appointment.clientType === "Student"
      ? ["Student Intake Form", "Remediation & Improvement"]
      : []),
    "Parents' Details",
    "Assessment Report",
    ...(appointment.clientType === "Normal"
      ? ["Plans & Session Improvement"]
      : []),
  ]);
  const [editing, setEditing] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("Application Form");
  const toggle = (name: string) =>
    setOpen((items) =>
      items.includes(name) ? items.filter((x) => x !== name) : [...items, name],
    );
  const editable = (name: string) => editing === name;
  const navigationItems = [
    "Application Form",
    ...(data.clientType === "Student" ? ["Student Intake Form", "Parents' Details", "Assessment Report", "Remediation & Improvement"] : []),
    ...(data.clientType === "Normal" ? ["Assessment Report", "Plans & Session Improvement"] : []),
    ...(data.clientType === "Parent" ? ["Parents' Details", "Assessment Report"] : []),
  ];
  const set = (key: keyof Appointment, value: string) =>
    setData((d) => ({ ...d, [key]: value }));
  useEffect(() => {
    const observers = navigationItems.map((item) => {
      const element = document.getElementById(item);
      if (!element) return null;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveSection(item);
      }, { rootMargin: "-18% 0px -65% 0px" });
      observer.observe(element);
      return observer;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, [data.clientType]);
  return (
    <div className="client-workspace">
      <div className="details-toolbar">
        <button className="secondary-button" onClick={onBack}>
          <FiArrowLeft /> Appointments
        </button>
        <div>

        </div>
      </div>
      <div className="details-layout !grid-cols-[220px_minmax(0,1fr)]">
        <nav className="sticky top-4 rounded-lg border border-[#c1c9c0] bg-white p-3">
          <p className="m-0 mb-2 text-[10px] font-extrabold text-[#414942]">ON THIS PAGE</p>
          {navigationItems.map((item) => (
            <button
              className={`block w-full rounded-md border-0 px-2 py-2.5 text-left transition ${activeSection === item ? "bg-[#bceecb] font-semibold text-[#144229]" : "bg-transparent text-[#414942] hover:bg-[#bceecb] hover:text-[#144229]"}`}
              key={item}
              onClick={() => {
                setOpen((x) => (x.includes(item) ? x : [...x, item]));
                setActiveSection(item);
                document
                  .getElementById(item)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {item}
            </button>
          ))}
        </nav>
        <main className="print-area">
          <div className="print-header">
            <Image src="/logo.webp" alt="Treasure" width={42} height={42} />
            <div>
              <strong>TREASURE</strong>
              <small>FOR THE PEOPLE&apos;S WELLBEING</small>
            </div>
            <span>
              9061200099
              <br />
              7306941801
            </span>
          </div>
          <div className="client-title">
            <div>
              <h1>{data.name}</h1>
              <p>
                {data.clientType} client · Age {data.age}
              </p>
            </div>
            <span className="status accepted">Accepted</span>
          </div>
          <div id="Application Form" className="application-print">
            <FormSection
              title="Application Form"
              open={open.includes("Application Form")}
              onToggle={() => toggle("Application Form")}
              editable={editable("Application Form")}
              onEdit={() =>
                setEditing(
                  editable("Application Form") ? null : "Application Form",
                )
              }
              onDownload={() => window.print()}
            >
              <div className="form-grid">
                <Field
                  label="Name"
                  value={data.name}
                  onChange={(v) => set("name", v)}
                  disabled={!editable("Application Form")}
                />
                <Field
                  label="Age"
                  value={data.age}
                  onChange={(v) => set("age", v)}
                  disabled={!editable("Application Form")}
                />
                <Field
                  label="Relative's name"
                  value={data.relative}
                  onChange={(v) => set("relative", v)}
                  disabled={!editable("Application Form")}
                />
                <Field
                  label="Address"
                  value={data.address}
                  onChange={(v) => set("address", v)}
                  disabled={!editable("Application Form")}
                />
                <Field
                  label="Phone"
                  value={`${data.countryCode} ${data.phone}`}
                  disabled
                />
                <label className="full-width">
                  <span>Purpose / presenting concern</span>
                  <textarea disabled={!editable("Application Form")} />
                </label>
              </div>
              <p className="malayalam">
                എൻ്റെ പരിപൂർണ സമ്മതത്തോടെയാണ് ഞാൻ കൗൺസിലിംഗിന്
                എത്തിയിരിക്കുന്നത്. ഇവിടെനിന്നും നൽകുന്ന നിർദേശങ്ങൾ
                സീകരിക്കുവാനം ചിട്ടയായ ജീവിത ശൈലിയിലൂടെ എൻ്റെ പ്രശ്ന‌ങ്ങൾ
                പരിഹരിക്കുവാനും ഞാൻ ആത്മാർത്ഥമായി ശ്രമിക്കും
              </p>
            </FormSection>
          </div>
          {data.clientType === "Student" && (
            <div id="Student Intake Form">
              <FormSection
                title="Student Intake Form"
                open={open.includes("Student Intake Form")}
                onToggle={() => toggle("Student Intake Form")}
                editable={editable("Student Intake Form")}
                onEdit={() =>
                  setEditing(
                    editable("Student Intake Form")
                      ? null
                      : "Student Intake Form",
                  )
                }
              >
                <TextGrid
                  editable={editable("Student Intake Form")}
                  labels={[
                    "Name",
                    "Gender",
                    "Age & DOB",
                    "Name of school & Place",
                    "Class",
                    "Medium",
                    "Board of Education",
                    "Father & Mother Name",
                    "Contact Number",
                    "Place & District",
                    "Medical Problem (if any)",
                    "Behavior issues",
                    "Psychological issues",
                    "History Of Family",
                    "Special Talents (if any)",
                    "Areas of improvement",
                    "Type of learner",
                    "Non-academic performance",
                    "Easy subject & language",
                    "Tough Subject & language",
                    "Pregnancy history",
                    "Developmental stages",
                    "Attitude of Father",
                    "Attitude of Mother",
                    "Family",
                  ]}
                />
              </FormSection>
            </div>
          )}
          <div id="Parents' Details">
            <FormSection
              title="Parents' Details"
              open={open.includes("Parents' Details")}
              onToggle={() => toggle("Parents' Details")}
              editable={editable("Parents' Details")}
              onEdit={() =>
                setEditing(
                  editable("Parents' Details") ? null : "Parents' Details",
                )
              }
            >
              <TextGrid
                editable={editable("Parents' Details")}
                labels={[
                  "Father's Name",
                  "Occupation",
                  "Contact Number",
                  "Education",
                  "Address",
                  "Mother's Name",
                  "Occupation",
                  "Contact Number",
                  "Education",
                  "Address",
                  "Type of family",
                  "Type of House",
                  "Child living with",
                  "Number of brothers",
                  "Number of sisters",
                  "Age difference with immediate sibling",
                  "Note",
                  "Assessed by",
                  "Name & Signature",
                  "Date",
                ]}
              />
            </FormSection>
          </div>
          <div id="Assessment Report">
            <FormSection
              title="Assessment Report"
              open={open.includes("Assessment Report")}
              onToggle={() => toggle("Assessment Report")}
              editable={editable("Assessment Report")}
              onEdit={() =>
                setEditing(
                  editable("Assessment Report") ? null : "Assessment Report",
                )
              }
            >
              <TextGrid
                editable={editable("Assessment Report")}
                labels={[
                  "Logical Thinking",
                  "Listening & following verbal instructions",
                  "Sequencing of Numbers",
                  "Sequencing of incidents",
                  "Reasoning",
                  "Number concept",
                  "General awareness",
                  "Attention",
                  "Visual memory",
                  "Verbal memory",
                  "Reading (Level)",
                  "General Reading",
                  "Writing",
                  "Mathematics",
                  "Family History (if any)",
                  "Presented Problem",
                  "Identified Problem",
                  "Remarks",
                  "Assessed by",
                  "Name & Signature",
                  "Date",
                ]}
              />
            </FormSection>
          </div>
          {data.clientType === "Student" && (
            <RepeatSection
              id="Remediation & Improvement"
              title="Remediation & Improvement"
              labels={["Date", "Remediation given", "Improvement seen"]}
            />
          )}
          {data.clientType === "Normal" && (
            <RepeatSection
              id="Plans & Session Improvement"
              title="Plans & Session Improvement"
              labels={[
                "Session Number / Date",
                "Plan / Recommendation",
                "Improvement Seen",
                "Doctor / Counsellor Name & Signature",
              ]}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function RepeatSection({
  id,
  title,
  labels,
}: {
  id: string;
  title: string;
  labels: string[];
}) {
  const [rows, setRows] = useState([1]);
  const [open, setOpen] = useState(true);
  return (
    <div id={id}>
      <Collapse className="!mt-5 overflow-hidden rounded-lg border border-[#c1c9c0] bg-white [&_.ant-collapse-header]:!items-center [&_.ant-collapse-header]:!py-4 [&_.ant-collapse-header-text]:!text-[#144229]" activeKey={open ? ["section"] : []} onChange={() => setOpen((value) => !value)} items={[{ key: "section", label: <strong>{title}</strong>, extra: <button type="button" className="flex h-8 w-8 items-center justify-center text-[#144229]" onClick={(event) => event.stopPropagation()} aria-label="Edit section"><FiEdit2 /></button>, children: (
          <div className="p-1">
            <div className="border border-[#c1c9c0] overflow-x-auto">
              {rows.map((row) => (
                <div key={row}>
                  <div className="flex items-center justify-between border-b border-[#c1c9c0] bg-[#bceecb] px-3 py-2 text-sm font-bold text-[#144229]">
                    <span>Section {row}</span>
                    {row > 1 && <button type="button" className="!text-[#9b3022] rounded p-1.5 hover:bg-white" aria-label={`Delete section ${row}`} onClick={() => setRows((items) => items.filter((item) => item !== row))}><FiTrash2 className="h-4 w-4" /></button>}
                  </div>
                <div className="grid min-w-[680px] grid-cols-3 border-b border-[#c1c9c0] last:border-b-0">
                  {labels.map((x) => (
                    <label key={x} className="flex min-w-0 flex-col gap-2 border-r border-[#c1c9c0] last:border-r-0">
                      <span className="bg-[#f4f4f0] px-2 py-2 font-bold text-[#144229]">{x}</span>
                      {x.toLowerCase().includes("date") ? <DatePicker className="repeat-date-picker !mx-1 !h-10 !w-[calc(100%-0.5rem)] !max-w-full !px-3 [&_.ant-picker-suffix]:!bg-transparent" format="DD/MM/YYYY" /> : <textarea className="!min-h-[74px] !w-full !resize-y !border-0 !p-3" />}
                    </label>
                  ))}
                </div></div>
              ))}
            </div>
            <button
              className="mt-3 inline-flex items-center gap-2 rounded-md border-0 bg-[#bceecb] px-4 py-2.5 font-bold text-[#144229]"
              onClick={() => setRows((r) => [...r, r.length + 1])}
            >
              <FiPlus /> Add {title.startsWith("Plans") ? "plan" : "section"}
            </button>
          </div>
        )}]} />
    </div>
  );
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Appointment[]>(() => {
    if (typeof window === "undefined") return seed;
    const saved = localStorage.getItem("treasure-appointments");
    return saved ? JSON.parse(saved) : seed;
  });
  const [form, setForm] = useState(blank);
  const [showAdd, setShowAdd] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const save = (next: Appointment[]) => {
    setRows(next);
    localStorage.setItem("treasure-appointments", JSON.stringify(next));
  };
  const filtered = useMemo(
    () =>
      rows.filter((r) =>
        `${r.name} ${r.clientType} ${r.status}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (selectedStatus === "all" || r.status === selectedStatus) &&
        (!dateRange?.[0] || !dateRange?.[1] || (() => { const date = dayjs(r.createdAt, "MMM D, YYYY"); return !date.isBefore(dateRange[0]!.startOf("day")) && !date.isAfter(dateRange[1]!.endOf("day")); })()),
      ),
    [rows, query, selectedStatus, dateRange],
  );
  const columns: Column<Appointment>[] = [
    {
      title: "Client",
      key: "name",
      render: (row) => (
        <>
          <strong>{row.name}</strong>
          <small className="table-sub">{row.phone}</small>
        </>
      ),
    },
    { title: "Age", key: "age" },
    { title: "Type", key: "clientType" },
    { title: "Date", key: "createdAt" },
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
          {row.status === "Pending" && (
            <>
              <button
                title="Accept"
                onClick={() =>
                  save(
                    rows.map((r) =>
                      r.id === row.id ? { ...r, status: "Accepted" } : r,
                    ),
                  )
                }
              >
                <FiCheck />
              </button>
              <button
                title="Reject"
                onClick={() =>
                  save(
                    rows.map((r) =>
                      r.id === row.id ? { ...r, status: "Rejected" } : r,
                    ),
                  )
                }
              >
                <FiX />
              </button>
            </>
          )}
          {row.status === "Accepted" && (
            <button
              className="view-button"
              onClick={() => router.push(`/client/viewdetails?id=${row.id}`)}
            >
              View Details
            </button>
          )}
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="mb-6 mt-7 flex items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-[var(--font-source-serif)] text-[30px] tracking-[-.03em]">Latest appointments</h1>
          <p>Review and manage your upcoming schedule.</p>
        </div>
        <button
          className="inline-flex h-fit items-center gap-2 rounded-md  bg-[#2D5A3F] px-4 py-3 font-bold text-white transition hover:bg-[#2d5a3f]"
          onClick={() => setShowAdd(true)}
        >
          <FiPlus /> Add Appointment
        </button>
      </div>
      <FilterHeader searchQuery={query} onSearchChange={setQuery} searchPlaceholder="Search by name, type, or status..." selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} statusOptions={[{ value: "all", label: "All Statuses" }, { value: "Accepted", label: "Accepted" }, { value: "Pending", label: "Pending" }, { value: "Rejected", label: "Rejected" }]} dateRange={dateRange} onDateRangeChange={setDateRange} />
      {showAdd && (
        <div className="content-card add-card">
          <div className="card-heading">
            <h3>New appointment</h3>
            <button onClick={() => setShowAdd(false)}>
              <FiX />
            </button>
          </div>
          <div className="form-grid">
            <Field
              label="Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />
            <Field
              label="Age"
              type="number"
              value={form.age}
              onChange={(v) => setForm({ ...form, age: v })}
            />
            <Field
              label="Relative's name"
              value={form.relative}
              onChange={(v) => setForm({ ...form, relative: v })}
            />
            <Field
              label="Address"
              value={form.address}
              onChange={(v) => setForm({ ...form, address: v })}
            />
            <div className="phone-field">
              <Field
                label="Phone code"
                value={form.countryCode}
                onChange={(v) => setForm({ ...form, countryCode: v })}
              />
              <Field
                label="Phone"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
              />
            </div>
            <label className="appointment-field">
              <span>Client type</span>
              <select
                value={form.clientType}
                onChange={(e) =>
                  setForm({ ...form, clientType: e.target.value as ClientType })
                }
              >
                <option>Student</option>
                <option>Parent</option>
                <option>Normal</option>
              </select>
            </label>
          </div>
          <button
            className="primary-button"
            onClick={() => {
              if (!form.name || !form.age) return;
              save([
                {
                  ...form,
                  id: Date.now(),
                  status: "Pending",
                  createdAt: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
                },
                ...rows,
              ]);
              setForm(blank);
              setShowAdd(false);
            }}
          >
            Create Appointment
          </button>
        </div>
      )}
      <section className="content-card w-full">
        <DataTable columns={columns} data={filtered} pageSize={10} />
      </section>
    </>
  );
}
