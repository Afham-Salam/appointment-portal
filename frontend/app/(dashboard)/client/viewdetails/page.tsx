"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ClientDetails, type Appointment } from "../../appointments/page";

function ClientDetailsRoute() {
  const router = useRouter();
  const params = useSearchParams();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const from = params.get("from");
  const backHref = from === "clients" ? "/clients" : "/appointments";
  const backLabel =
    from === "clients" ? "Clients" : "Appointments";

  useEffect(() => {
    const id = Number(params.get("id"));
    const saved = localStorage.getItem("treasure-appointments");
    const rows: Appointment[] = saved ? JSON.parse(saved) : [];
    setAppointment(rows.find((row) => row.id === id) ?? null);
  }, [params]);

  if (!appointment)
    return (
      <div className="rounded-lg border border-[#c1c9c0] bg-white p-6 shadow-sm">
        <h2 className="mb-4  text-2xl text-[#1a1c1a]">
          Client not found
        </h2>
        <button
          className="inline-flex items-center rounded-md border border-[#c1c9c0] bg-white px-3.5 py-2.5 font-bold text-[#144229]"
          onClick={() => router.push(backHref)}
        >
          Back to {backLabel.toLowerCase()}
        </button>
      </div>
    );

  return (
    <ClientDetails
      appointment={appointment}
      onBack={() => router.push(backHref)}
      backLabel={backLabel}
    />
  );
}

export default function ClientViewDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-lg border border-[#c1c9c0] bg-white p-6 text-[#414942]">
          Loading client details...
        </div>
      }
    >
      <ClientDetailsRoute />
    </Suspense>
  );
}
