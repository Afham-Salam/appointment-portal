"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/DataTable";
import { FilterHeader } from "@/components/FilterHeader";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Checkbox, Collapse, DatePicker } from "antd";
import {
  FiArrowLeft,
  FiCheck,
  FiDownload,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import AddAppointmentModal from "@/components/AddAppointmentModal";
import { downloadApplicationPdf } from "@/components/ApplicationPdf";

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
        className="h-11 rounded-md border border-[#c1c9c0] bg-white px-3 text-sm text-[#1a1c1a] outline-none transition focus:border-[#2D5A3F] focus:ring-2 focus:ring-[#2D5A3F]/15 disabled:bg-[#f4f4f0] disabled:text-[#414942]"
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
              <button
                type="button"
                className="flex h-8 w-8 cursor-pointer items-center justify-center text-[#144229]"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit();
                }}
                aria-label={`Edit ${title}`}
              >
                <FiEdit2 />
              </button>
              {onDownload && (
                <button
                  type="button"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center text-[#144229] disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDownload();
                  }}
                  aria-label="Download application PDF"
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
  backLabel = "Appointments",
}: {
  appointment: Appointment;
  onBack: () => void;
  backLabel?: string;
}) {
  const [data, setData] = useState(appointment);
  const [currentProblem, setCurrentProblem] = useState("");
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [open, setOpen] = useState<string[]>([
    "Application Form",
    ...(appointment.clientType === "Student"
      ? ["Student Intake Form", "Remediation & Improvement"]
      : []),
    "Parents' Details",
    "Assessment Report",
    ...(appointment.clientType === "Normal"
      ? ["Mental Status Exam", "Plans"]
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
    ...(data.clientType === "Student"
      ? [
          "Student Intake Form",
          "Parents' Details",
          "Assessment Report",
          "Remediation & Improvement",
        ]
      : []),
    ...(data.clientType === "Normal"
      ? ["Mental Status Exam", "Plans"]
      : []),
    ...(data.clientType === "Parent"
      ? ["Parents' Details", "Assessment Report"]
      : []),
  ];
  const set = (key: keyof Appointment, value: string) =>
    setData((d) => ({ ...d, [key]: value }));
  useEffect(() => {
    const observers = navigationItems.map((item) => {
      const element = document.getElementById(item);
      if (!element) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(item);
        },
        { rootMargin: "-18% 0px -65% 0px" },
      );
      observer.observe(element);
      return observer;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, [data.clientType]);
  return (
    <div className="client-workspace">
      <div className="details-toolbar">
        <button className="secondary-button" onClick={onBack}>
          <FiArrowLeft /> {backLabel}
        </button>
        <div></div>
      </div>
      <div className="details-layout grid-cols-[220px_minmax(0,1fr)]!">
        <nav className="sticky top-4 rounded-lg border border-[#c1c9c0] bg-white p-3">
          <p className="m-0 mb-2 text-[10px] font-extrabold text-[#414942]">
            ON THIS PAGE
          </p>
          <div className="flex flex-col gap-1">
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
          </div>
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
              onDownload={async () => {
                if (downloadingPdf) return;
                try {
                  setDownloadingPdf(true);
                  await downloadApplicationPdf({
                    name: data.name,
                    age: data.age,
                    relative: data.relative,
                    address: data.address,
                    phone: `${data.countryCode} ${data.phone}`.trim(),
                    currentProblem,
                  });
                } catch (error) {
                  console.error(error);
                  window.alert(
                    "Could not generate the PDF. Please try again.",
                  );
                } finally {
                  setDownloadingPdf(false);
                }
              }}
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
                <label className="full-width flex flex-col gap-1.5 text-[13px] text-[#144229]">
                  <span className="font-medium">Current problem</span>
                  <textarea
                    value={currentProblem}
                    onChange={(event) => setCurrentProblem(event.target.value)}
                    disabled={!editable("Application Form")}
                    className="min-h-24 w-full rounded-md border border-[#c1c9c0] bg-white p-3 text-sm text-[#1a1c1a] outline-none transition focus:border-[#2D5A3F] focus:ring-2 focus:ring-[#2D5A3F]/15 disabled:bg-[#f4f4f0] disabled:text-[#414942]"
                  />
                </label>
              </div>
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
          {(data.clientType === "Student" || data.clientType === "Parent") && (
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
          )}
          {(data.clientType === "Student" || data.clientType === "Parent") && (
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
          )}
          {data.clientType === "Student" && (
            <RepeatSection
              id="Remediation & Improvement"
              title="Remediation & Improvement"
              labels={["Date", "Remediation given", "Improvement seen"]}
            />
          )}
          {data.clientType === "Normal" && (
            <div id="Mental Status Exam">
              <FormSection
                title="Mental Status Exam"
                open={open.includes("Mental Status Exam")}
                onToggle={() => toggle("Mental Status Exam")}
                editable={editable("Mental Status Exam")}
                onEdit={() =>
                  setEditing(
                    editable("Mental Status Exam")
                      ? null
                      : "Mental Status Exam",
                  )
                }
              >
                <div className="flex flex-col gap-4">
                  <div className="form-grid">
                    <Field
                      label="Client Name"
                      value={data.name}
                      disabled
                    />
                    <label className="flex flex-col gap-1.5 text-[13px] text-[#144229]">
                      <span className="font-medium">Date</span>
                      <DatePicker
                        format="DD/MM/YYYY"
                        disabled={!editable("Mental Status Exam")}
                        className="h-11! w-full"
                      />
                    </label>
                  </div>

                  {(
                    [
                      {
                        title: "OBSERVATIONS",
                        rows: [
                          [
                            "Appearance",
                            [
                              "Neat",
                              "Dishevelled",
                              "Inappropriate",
                              "Bizarre",
                              "Other",
                            ],
                          ],
                          [
                            "Speech",
                            [
                              "Normal",
                              "Tangential",
                              "Pressured",
                              "Impoverished",
                              "Other",
                            ],
                          ],
                          [
                            "Eye Contact",
                            ["Normal", "Intense", "Avoidant", "Other"],
                          ],
                          [
                            "Motor Activity",
                            ["Normal", "Restless", "Tics", "Slowed", "Other"],
                          ],
                          [
                            "Affect",
                            ["Full", "Constricted", "Flat", "Labile", "Other"],
                          ],
                        ],
                      },
                      {
                        title: "MOOD",
                        rows: [
                          [
                            "Mood",
                            [
                              "Euthymic",
                              "Anxious",
                              "Angry",
                              "Depressed",
                              "Euphoric",
                              "Irritable",
                              "Other",
                            ],
                          ],
                        ],
                      },
                      {
                        title: "COGNITION",
                        rows: [
                          [
                            "Orientation Impairment",
                            ["None", "Place", "Object", "Person", "Time"],
                          ],
                          [
                            "Memory Impairment",
                            ["None", "Short-Term", "Long-Term", "Other"],
                          ],
                          ["Attention", ["Normal", "Distracted", "Other"]],
                        ],
                      },
                      {
                        title: "PERCEPTION",
                        rows: [
                          [
                            "Hallucinations",
                            ["None", "Auditory", "Visual", "Other"],
                          ],
                          [
                            "Other",
                            ["None", "Derealization", "Depersonalization"],
                          ],
                        ],
                      },
                      {
                        title: "THOUGHTS",
                        rows: [
                          [
                            "Suicidality",
                            [
                              "None",
                              "Ideation",
                              "Plan",
                              "Intent",
                              "Self-Harm",
                            ],
                          ],
                          [
                            "Homicidality",
                            ["None", "Aggressive", "Intent", "Plan"],
                          ],
                          [
                            "Delusions",
                            [
                              "None",
                              "Grandiose",
                              "Paranoid",
                              "Religious",
                              "Other",
                            ],
                          ],
                        ],
                      },
                      {
                        title: "BEHAVIOR",
                        rows: [
                          [
                            "Behavior",
                            [
                              "Cooperative",
                              "Guarded",
                              "Hyperactive",
                              "Agitated",
                              "Paranoid",
                              "Stereotyped",
                              "Aggressive",
                              "Bizarre",
                              "Withdrawn",
                              "Other",
                            ],
                          ],
                        ],
                      },
                    ] as const
                  ).map((section) => (
                    <div
                      key={section.title}
                      className="rounded-md border border-[#c1c9c0] bg-[#faf9f6] p-4"
                    >
                      <h4 className="m-0 mb-3 text-sm font-bold text-[#144229]">
                        {section.title}
                      </h4>
                      {section.rows.map(([label, options]) => (
                        <div
                          key={label}
                          className="grid grid-cols-1 gap-2 border-b border-[#e8e8e5] py-2.5 last:border-b-0 sm:grid-cols-[180px_minmax(0,1fr)]"
                        >
                          <span className="text-sm font-semibold text-[#144229]">
                            {label}
                          </span>
                          <Checkbox.Group
                            disabled={!editable("Mental Status Exam")}
                            className="flex flex-wrap gap-x-4 gap-y-2"
                            options={options.map((option) => ({
                              label: option,
                              value: option,
                            }))}
                          />
                        </div>
                      ))}
                      <label className="mt-3 flex flex-col gap-1.5">
                        <span className="text-sm font-semibold text-[#144229]">
                          Comments:
                        </span>
                        <textarea
                          disabled={!editable("Mental Status Exam")}
                          className="min-h-20 w-full rounded-md border border-[#c1c9c0] p-3"
                        />
                      </label>
                    </div>
                  ))}

                  <div className="rounded-md border border-[#c1c9c0] bg-[#faf9f6] p-4">
                    <h4 className="m-0 mb-3 text-sm font-bold text-[#144229]">
                      INSIGHT & JUDGEMENT
                    </h4>
                    {(["INSIGHT", "JUDGEMENT"] as const).map((row) => (
                      <div
                        key={row}
                        className="mb-3 grid grid-cols-1 gap-3 border-b border-[#e8e8e5] pb-3 last:mb-0 last:border-b-0 last:pb-0 sm:grid-cols-[120px_minmax(0,1fr)_minmax(0,1.2fr)] sm:items-center"
                      >
                        <span className="text-sm font-bold text-[#144229]">
                          {row}
                        </span>
                        <Checkbox.Group
                          disabled={!editable("Mental Status Exam")}
                          className="flex flex-wrap gap-x-4 gap-y-2"
                          options={["Good", "Fair", "Poor"].map((option) => ({
                            label: option,
                            value: option,
                          }))}
                        />
                        <input
                          disabled={!editable("Mental Status Exam")}
                          placeholder="Comments"
                          className="h-11 rounded-md border border-[#c1c9c0] px-3"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </FormSection>
            </div>
          )}
          {data.clientType === "Normal" && (
            <RepeatSection
              id="Plans"
              title="Plans"
              labels={[
                "Date",
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
      <Collapse
        className="mt-5! overflow-hidden rounded-lg border border-[#c1c9c0] bg-white [&_.ant-collapse-header]:items-center! [&_.ant-collapse-header]:py-4! [&_.ant-collapse-header-text]:text-[#144229]!"
        activeKey={open ? ["section"] : []}
        onChange={() => setOpen((value) => !value)}
        items={[
          {
            key: "section",
            label: <strong>{title}</strong>,
            extra: (
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center text-[#144229]"
                onClick={(event) => event.stopPropagation()}
                aria-label="Edit section"
              >
                <FiEdit2 />
              </button>
            ),
            children: (
              <div className="p-1">
                <div className="border border-[#c1c9c0] overflow-x-auto">
                  {rows.map((row) => (
                    <div key={row}>
                      <div className="flex items-center justify-between border-b border-[#c1c9c0] bg-[#bceecb] px-3 py-2 text-sm font-bold text-[#144229]">
                        <span>Section {row}</span>
                        {row > 1 && (
                          <button
                            type="button"
                            className="text-[#9b3022]! rounded p-1.5 hover:bg-white"
                            aria-label={`Delete section ${row}`}
                            onClick={() =>
                              setRows((items) =>
                                items.filter((item) => item !== row),
                              )
                            }
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid min-w-170 grid-cols-3 border-b border-[#c1c9c0] last:border-b-0">
                        {labels.map((x) => (
                          <label
                            key={x}
                            className="flex min-w-0 flex-col gap-2 border-r border-[#c1c9c0] last:border-r-0"
                          >
                            <span className="bg-[#f4f4f0] px-2 py-2 font-bold text-[#144229]">
                              {x}
                            </span>
                            {x.toLowerCase().includes("date") ? (
                              <DatePicker
                                className="repeat-date-picker mx-1! h-10! w-[calc(100%-0.5rem)]! max-w-full! px-3! [&_.ant-picker-suffix]:bg-transparent!"
                                format="DD/MM/YYYY"
                              />
                            ) : (
                              <textarea className="min-h-18.5! w-full! resize-y! border-0! p-3!" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="mt-3 inline-flex items-center gap-2 rounded-md border-0 bg-[#24593f] px-4 py-2.5 font-bold text-[#ffffff]"
                  onClick={() => setRows((r) => [...r, r.length + 1])}
                >
                  <FiPlus /> Add{" "}
                  {title.startsWith("Plans") ? "plan" : "section"}
                </button>
              </div>
            ),
          },
        ]}
      />
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
  const [showAdd, setShowAdd] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const save = (next: Appointment[]) => {
    setRows(next);
    localStorage.setItem("treasure-appointments", JSON.stringify(next));
  };
  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          `${r.name} ${r.clientType} ${r.status}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (selectedStatus === "all" || r.status === selectedStatus) &&
          (!dateRange?.[0] ||
            !dateRange?.[1] ||
            (() => {
              const date = dayjs(r.createdAt, "MMM D, YYYY");
              return (
                !date.isBefore(dateRange[0]!.startOf("day")) &&
                !date.isAfter(dateRange[1]!.endOf("day"))
              );
            })()),
      ),
    [rows, query, selectedStatus, dateRange],
  );
  const columns: Column<Appointment>[] = [
    {
      title: "Sl No",
      key: "slNo",
      render: (_row, index) => index + 1,
    },
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
          <h1 className="m-0 font-(--font-source-serif) text-[30px] tracking-[-.03em]">
            Latest appointments
          </h1>
          <p>Review and manage your upcoming schedule.</p>
        </div>
        <button
          className="inline-flex h-fit items-center gap-2 rounded-md  bg-[#2D5A3F] px-4 py-3 font-bold text-white transition hover:bg-[#2d5a3f]"
          onClick={() => setShowAdd(true)}
        >
          <FiPlus /> Add Appointment
        </button>
      </div>
      <FilterHeader
        searchQuery={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search by name, phone, type, or status..."
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        statusOptions={[
          { value: "all", label: "All Statuses" },
          { value: "Accepted", label: "Accepted" },
          { value: "Pending", label: "Pending" },
          { value: "Rejected", label: "Rejected" },
        ]}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      <AddAppointmentModal
        open={showAdd}
        onCancel={() => setShowAdd(false)}
        onSubmit={(form) => {
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
          setShowAdd(false);
        }}
      />

      <section className="content-card w-full">
        <DataTable columns={columns} data={filtered} pageSize={10} />
      </section>
    </>
  );
}
