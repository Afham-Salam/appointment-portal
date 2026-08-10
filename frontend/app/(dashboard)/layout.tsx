"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiMenu,
  FiUsers,
} from "react-icons/fi";

const navigation = [
  { key: "/dashboard", icon: <FiGrid />, label: "Dashboard" },
  { key: "/appointments", icon: <FiCalendar />, label: "Latest appointments" },
  { key: "/clients", icon: <FiUsers />, label: "Clients" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const current =
    navigation.find((item) => pathname.startsWith(item.key))?.key ??
    "/dashboard";

  useEffect(() => {
    const update = () => setMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="app-layout">
      <aside
        className={`app-sider ${collapsed ? "is-collapsed" : ""} ${mobile && !mobileOpen ? "is-hidden" : ""}`}
      >
        <div className="brand">
          <span className="brand-mark">+</span>
          <span className="brand-name">Careflow</span>
        </div>
        <nav className="side-nav">
          {navigation.map((item) => (
            <Link
              onClick={() => mobile && setMobileOpen(false)}
              className={current === item.key ? "active" : ""}
              href={item.key}
              key={item.key}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        <button
          className="collapse-button"
          onClick={() =>
            mobile ? setMobileOpen(false) : setCollapsed(!collapsed)
          }
          aria-label="Toggle sidebar"
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </aside>
      {mobile && mobileOpen && (
        <button
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <div className="app-main">
        <header className="app-header">
          <div className="header-left">
            {mobile && (
              <button
                className="mobile-menu-button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
              >
                <FiMenu />
              </button>
            )}
            <div>
              <span className="eyebrow">CARE MANAGEMENT</span>
              <h2>Good morning, Dr. Morgan</h2>
            </div>
          </div>
          <button className="profile-button" aria-label="Open profile menu">
            <span className="avatar">DM</span>
            <span>Dr. Morgan</span>
          </button>
        </header>
        <main className="app-content">
          <div className="breadcrumb">
            Workspace <span>/</span>{" "}
            <strong>
              {pathname === "/dashboard"
                ? "Dashboard"
                : pathname.slice(1).replace("-", " ")}
            </strong>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
