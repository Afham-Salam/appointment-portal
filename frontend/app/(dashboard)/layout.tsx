"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import Sidebar from "@/components/Sidebar";
import NotificationMenu from "@/components/NotificationMenu";
import ProfileMenu from "@/components/ProfileMenu";
import { NotificationsProvider } from "@/components/NotificationsProvider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const update = () => setMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <NotificationsProvider>
      <div className="flex h-dvh overflow-hidden bg-[#faf9f6]">
        <Sidebar
          mobile={mobile}
          mobileOpen={mobileOpen}
          onNavigate={() => mobile && setMobileOpen(false)}
        />

        {mobile && mobileOpen && (
          <button
            className="fixed inset-0 z-1000 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          />
        )}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex h-21 shrink-0 items-center justify-between border-b border-[#c1c9c0] bg-white px-4 md:px-8">
            <div className="flex min-w-0 items-center gap-3.5">
              {mobile && (
                <button
                  className="inline-flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-md bg-[#bceecb] text-[#144229]"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open navigation"
                >
                  <FiMenu />
                </button>
              )}
              <div>
                <p className="m-0 hidden text-[20px] font-bold tracking-wide text-[#144229] md:block md:text-xl">
                  Appointment Portal
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationMenu />
              <ProfileMenu />
            </div>
          </header>

          <main className="min-h-0 w-full flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-7">
            <div className="mb-4 text-sm text-[#414942]">
              Workspace <span className="mx-1">/</span>{" "}
              <strong className="capitalize text-[#1a1c1a]">
                {pathname === "/dashboard"
                  ? "Dashboard"
                  : pathname.slice(1).replace("-", " ")}
              </strong>
            </div>
            {children}
          </main>
        </div>
      </div>
    </NotificationsProvider>
  );
}
