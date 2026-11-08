import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  seedNotifications,
  type MockNotification,
} from "@/data/notifications";
import { useAccount } from "@/store/account-store";

const STORAGE_PREFIX = "hisa.notifications.";

const readIds = (userKey: string | null): Set<string> => {
  if (!userKey) return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + userKey);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? new Set(parsed.filter((id): id is string => typeof id === "string"))
      : new Set();
  } catch {
    return new Set();
  }
};

const writeIds = (userKey: string | null, ids: Set<string>) => {
  if (!userKey) return;
  try {
    window.localStorage.setItem(
      STORAGE_PREFIX + userKey,
      JSON.stringify([...ids]),
    );
  } catch {
    // Storage can be unavailable; read state still works for the session.
  }
};

export type NotificationItem = MockNotification & { isRead: boolean };

type NotificationContextValue = {
  notifications: NotificationItem[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAccount();
  const userKey = user?.email?.trim().toLowerCase() ?? null;
  const [read, setRead] = useState<Set<string>>(() => readIds(userKey));

  useEffect(() => {
    setRead(readIds(userKey));
  }, [userKey]);

  const notifications = useMemo<NotificationItem[]>(() => {
    if (!userKey) return [];
    return seedNotifications
      .map((notification) => ({
        ...notification,
        isRead: notification.readByDefault || read.has(notification.id),
      }))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [read, userKey]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const markRead = useCallback(
    (id: string) => {
      setRead((current) => {
        if (current.has(id)) return current;
        const next = new Set(current);
        next.add(id);
        writeIds(userKey, next);
        return next;
      });
    },
    [userKey],
  );

  const markAllRead = useCallback(() => {
    setRead((current) => {
      const next = new Set(current);
      seedNotifications.forEach((notification) => next.add(notification.id));
      writeIds(userKey, next);
      return next;
    });
  }, [userKey]);

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }
  return context;
};
