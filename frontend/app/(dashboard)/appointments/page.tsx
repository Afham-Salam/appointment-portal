"use client";
import { AppointmentTable } from "../dashboard/page";
const rows = [
  "Amelia Carter",
  "Noah Williams",
  "Olivia Brown",
  "Liam Davis",
  "Emma Wilson",
].map((patient, index) => ({
  patient,
  type: ["General consultation", "Follow-up visit", "Annual check-up"][
    index % 3
  ],
  time: `Aug ${10 + index}, 2026`,
  status: index === 1 ? "Pending" : "Confirmed",
}));
export default function AppointmentsPage() {
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Latest appointments</h1>
          <p>Review and manage your upcoming schedule.</p>
        </div>
      </div>
      <section className="content-card">
        <AppointmentTable rows={rows} />
      </section>
    </>
  );
}
