"use client";

import { useNotifications } from "@/components/NotificationsProvider";

export default function NotificationPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  return (
    <>
      <div className="page-heading flex items-center justify-between gap-4">
        <div>
          <h1>Notifications</h1>
          <p>Stay on top of appointment updates and client activity.</p>
        </div>
        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={markAllAsRead}
            className="cursor-pointer rounded-md bg-[#bceecb] px-3 py-1.5 text-sm font-semibold text-[#144229] transition hover:bg-[#a8e0ba]"
          >
            Mark all as read ({unreadCount})
          </button>
        ) : (
          <span className="rounded-md bg-[#f4f4f0] px-3 py-1.5 text-sm font-medium text-[#69746d]">
            All caught up
          </span>
        )}
      </div>

      <section className="overflow-hidden rounded-md border border-[#c1c9c0] bg-white shadow-[0_5px_20px_rgba(23,32,42,0.03)]">
        <ul className="m-0 list-none divide-y divide-[#e8e8e5] p-0">
          {notifications.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => markAsRead(item.id)}
                className={`flex w-full cursor-pointer items-start gap-4 px-5 py-4 text-left transition ${
                  item.unread
                    ? "bg-[#2D5A3F]/8 hover:bg-[#2D5A3F]/12"
                    : "bg-white hover:bg-[#faf9f6]"
                }`}
              >
                <span
                  className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-md ${
                    item.unread ? "bg-[#2D5A3F]" : "bg-transparent"
                  }`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3
                      className={`m-0 text-sm ${
                        item.unread
                          ? "font-semibold text-[#144229]"
                          : "font-medium text-[#1a1c1a]"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <time className="text-xs text-[#69746d]">{item.time}</time>
                  </div>
                  <p className="mt-1 mb-0 text-sm text-[#414942]">
                    {item.message}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
