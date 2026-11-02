import Link from "next/link";
import type { IconType } from "react-icons";

export default function DashboardStatCard({
  label,
  value,
  icon: Icon,
  highlighted = false,
  href,
}: {
  label: string;
  value: number;
  icon: IconType;
  highlighted?: boolean;
  href?: string;
}) {
  const card = (
    <article
      className={`group relative min-w-0 overflow-hidden rounded-2xl p-5 transition duration-200 hover:-translate-y-0.5 motion-reduce:transform-none ${
        href ? "cursor-pointer" : ""
      } ${
        highlighted
          ? "bg-linear-to-br from-[#34694a] via-[#2D5A3F] to-[#193d2a] text-white shadow-[0_8px_24px_rgba(45,90,63,0.20)] hover:shadow-[0_12px_28px_rgba(45,90,63,0.28)]"
          : "border border-[#e0e7dc] bg-linear-to-br from-white to-[#f3f6ef] shadow-[0_3px_14px_rgba(45,90,63,0.04)] hover:shadow-[0_8px_24px_rgba(45,90,63,0.09)]"
      }`}
    >
      <div
        aria-hidden="true"
        className={`absolute -right-7 -top-7 h-28 w-28 rounded-full transition-transform group-hover:scale-110 ${
          highlighted ? "bg-white/5" : "bg-[#e7eddf]/60"
        }`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={`m-0 text-xs font-semibold leading-5 ${
              highlighted ? "text-[#e3efdf]" : "text-[#566551]"
            }`}
          >
            {label}
          </p>
          <p
            className={`mb-0 mt-3 text-4xl font-bold tracking-tight tabular-nums ${
              highlighted ? "text-white" : "text-[#244632]"
            }`}
          >
            {value.toLocaleString("en-IN")}
          </p>
        </div>
        <span
          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            highlighted
              ? "bg-white/15 text-[#e8d6a3] ring-1 ring-white/15"
              : "bg-[#e5eddf] text-[#2D5A3F] ring-4 ring-white/80"
          }`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <div
        className={`relative mt-4 flex items-center gap-2 border-t pt-3 text-[11px] font-medium ${
          highlighted
            ? "border-white/15 text-[#dfebdc]"
            : "border-[#e2e8dd] text-[#78826f]"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            highlighted ? "bg-[#e5cb88]" : "bg-[#90a480]"
          }`}
        />
        {highlighted
          ? "Your schedule for today"
          : label.includes("Clients")
            ? "Clinic client overview"
            : "Appointment overview"}
        {highlighted && (
          <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#e8d6a3]">
            Today
          </span>
        )}
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block no-underline">
        {card}
      </Link>
    );
  }

  return card;
}
