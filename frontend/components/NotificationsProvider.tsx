"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
};

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "New appointment request",
    message: "Amelia Carter requested a consultation for tomorrow.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "2",
    title: "Draft awaiting approval",
    message: "Noah Williams appointment is waiting for your review.",
    time: "25 min ago",
    unread: true,
  },
  {
    id: "3",
    title: "Appointment confirmed",
    message: "Olivia Brown confirmed her annual check-up.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "4",
    title: "Client profile updated",
    message: "Liam Davis updated contact details.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "5",
    title: "Reminder",
    message: "You have 12 appointments scheduled for today.",
    time: "Yesterday",
    unread: false,
  },
];

type NotificationsContextValue = {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null,
);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);

  const markAsRead = useCallback((id: string) => {
    setNotifications((items) =>
      items.map((item) =>
        item.id === id ? { ...item, unread: false } : item,
      ),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((items) =>
      items.map((item) => ({ ...item, unread: false })),
    );
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications],
  );

  const value = useMemo(
    () => ({ notifications, unreadCount, markAsRead, markAllAsRead }),
    [notifications, unreadCount, markAsRead, markAllAsRead],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationsProvider",
    );
  }
  return context;
}
