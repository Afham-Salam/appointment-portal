"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiBell } from "react-icons/fi";
import { useNotifications } from "@/components/NotificationsProvider";

export default function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const preview = notifications.slice(0, 4);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-[#c1c9c0] bg-white text-[#2D5A3F] transition hover:bg-[#f4f4f0]"
        aria-label="Open notifications"
        aria-expanded={open}
      >
        <FiBell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-md bg-[#2D5A3F] px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-85 overflow-hidden rounded-md border border-[#c1c9c0] bg-white shadow-[0_12px_32px_rgba(23,32,42,0.12)]">
          <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3">
            <p className="m-0 text-sm font-semibold text-[#1a1c1a]">
              Notifications
            </p>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllAsRead}
                className="cursor-pointer rounded-md bg-[#bceecb] px-2 py-0.5 text-xs font-semibold text-[#144229] transition hover:bg-[#a8e0ba]"
              >
                Mark all read
              </button>
            ) : (
              <span className="text-xs text-[#69746d]">All caught up</span>
            )}
          </div>

          <ul className="m-0 max-h-80 list-none overflow-y-auto p-0">
            {preview.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => markAsRead(item.id)}
                  className={`flex w-full cursor-pointer flex-col gap-1 border-b border-[#eee] px-4 py-3 text-left transition last:border-b-0 ${
                    item.unread
                      ? "bg-[#2D5A3F]/8 hover:bg-[#2D5A3F]/12"
                      : "bg-white hover:bg-[#faf9f6]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`text-sm ${item.unread ? "font-semibold text-[#144229]" : "font-medium text-[#1a1c1a]"}`}
                    >
                      {item.title}
                    </span>
                    {item.unread ? (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-md bg-[#2D5A3F]" />
                    ) : null}
                  </div>
                  <span className="text-xs leading-relaxed text-[#414942]">
                    {item.message}
                  </span>
                  <span className="text-[11px] text-[#69746d]">{item.time}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-[#e5e7eb] p-2">
            <Link
              href="/notification"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-md px-3 py-2.5 text-sm font-semibold text-[#2D5A3F] transition hover:bg-[#f4f4f0]"
            >
              View all
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
