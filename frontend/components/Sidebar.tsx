"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiCalendar,
  FiGrid,
  FiLogOut,
  FiPlus,
  FiSettings,
  FiUsers,
} from "react-icons/fi";

const navigation = [
  { href: "/dashboard", icon: FiGrid, label: "Dashboard" },
  { href: "/appointments", icon: FiCalendar, label: "Appointments" },
  { href: "/clients", icon: FiUsers, label: "Clients List" },
  { href: "/settings", icon: FiSettings, label: "Settings" },
] as const;

type SidebarProps = {
  mobile?: boolean;
  mobileOpen?: boolean;
  onNavigate?: () => void;
};

export default function Sidebar({
  mobile = false,
  mobileOpen = false,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const current =
    navigation.find((item) => pathname.startsWith(item.href))?.href ??
    "/dashboard";

  return (
    <aside
      className={`flex h-dvh w-60 shrink-0 flex-col border-r border-[#e5e7eb] bg-[#edede8] px-4 py-6 transition-transform duration-200 ${
        mobile
          ? `fixed inset-y-0 left-0 z-1001 shadow-xl ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`
          : "sticky top-0"
      }`}
      aria-label="Main navigation"
    >
      <div className="mb-8 flex justify-center px-2">
        <Image
          src="/logo.webp"
          alt="Treasure Counseling Center"
          width={72}
          height={72}
          className="h-14 w-14 object-contain"
          priority
        />
      </div>

      <Link
        href="/appointments"
        onClick={onNavigate}
        className="mb-8 flex items-center justify-center gap-2 rounded-md bg-[#2D5A3F] px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#16482b]"
      >
        <FiPlus className="h-4 w-4 shrink-0" />
        New Appointment
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {navigation.map(({ href, icon: Icon, label }) => {
          const active = current === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`relative flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-white text-[#2D5A3F] shadow-sm"
                  : "text-gray-600 hover:bg-white/70 hover:text-[#2D5A3F]"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-11 w-1 -translate-y-1/2 rounded-r-lg bg-[#2D5A3F]" />
              )}
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          router.push("/login");
        }}
        className="cursor-pointer mt-auto flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-white/70 hover:text-[#2D5A3F]"
      >
        <FiLogOut className="h-5 w-5 shrink-0" />
        Logout
      </button>
    </aside>
  );
}
