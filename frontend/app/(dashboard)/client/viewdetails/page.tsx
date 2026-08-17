"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ClientDetails } from "../../appointments/page";
import { getClientDetails } from "@/lib/actions/appointments";
import type { Appointment } from "../../appointments/page";

function ClientDetailsRoute() {
  const router = useRouter();
  const params = useSearchParams();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [clientData, setClientData] = useState<Awaited<ReturnType<typeof getClientDetails>>["data"]>(null);
  const [loading, setLoading] = useState(true);

  const from = params.get("from");
  const backHref = from === "clients" ? "/clients" : "/appointments";
  const backLabel = from === "clients" ? "Clients" : "Appointments";

  useEffect(() => {
    async function fetch() {
      const id = params.get("id");
      if (!id) {
        setLoading(false);
        return;
      }

      const result = await getClientDetails(id);

      if (result.data) {
        const { client, appointment: apt } = result.data;

        setAppointment({
          id: apt?.id || "",
          name: client.name,
          age: client.age || "",
          relative: client.relative || "",
          address: client.address || "",
          countryCode: client.country_code || "+91",
          phone: client.phone,
          clientType: client.client_type as "Student" | "Client",
          status: (apt?.status as "Pending" | "Accepted" | "Rejected") || "Accepted",
          createdAt: new Date(client.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          clientId: client.id,
        });

        setClientData(result.data);
      }

      setLoading(false);
    }
    fetch();
  }, [params]);

  if (loading) {
    return (
      <div className="rounded-lg border border-[#c1c9c0] bg-white p-6 text-[#414942]">
        Loading client details...
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="rounded-lg border border-[#c1c9c0] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl text-[#1a1c1a]">Client not found</h2>
        <button
          className="inline-flex items-center rounded-md border border-[#c1c9c0] bg-white px-3.5 py-2.5 font-bold text-[#144229]"
          onClick={() => router.push(backHref)}
        >
          Back to {backLabel.toLowerCase()}
        </button>
      </div>
    );
  }

  return (
    <ClientDetails
      appointment={appointment}
      clientData={clientData}
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