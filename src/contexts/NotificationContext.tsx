import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import type { NotificationRecord } from "../api/notification";
import {
  fetchUserNotifications,
  markNotificationAsRead,
} from "../api/notification";

type NotificationContextValue = {
  notifications: NotificationRecord[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  refresh: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

const FIRST_PAGE = 0;
const PAGE_SIZE = 30;

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastLoadedUser = useRef<string | null>(null);

  const resetState = useCallback(() => {
    setNotifications([]);
    setError(null);
    lastLoadedUser.current = null;
  }, []);

  const loadNotifications = useCallback(async () => {
    if (!token || !user?.id) {
      resetState();
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const page = await fetchUserNotifications(
        token,
        user.id,
        FIRST_PAGE,
        PAGE_SIZE
      );
      const sorted = (page.content ?? [])
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      setNotifications(sorted);
      lastLoadedUser.current = user.id;
    } catch (err: any) {
      console.error("Khong the tai thong bao", err);
      setError(err?.message ?? "Khong the tai thong bao");
    } finally {
      setLoading(false);
    }
  }, [token, user?.id, resetState]);

  useEffect(() => {
    if (!token || !user?.id) {
      resetState();
      return;
    }

    if (lastLoadedUser.current !== user.id) {
      loadNotifications();
    }
  }, [token, user?.id, loadNotifications, resetState]);

  const markAsRead = useCallback(
    async (id: number) => {
      if (!token) {
        return;
      }

      let previousState: { seen: boolean; seenAt: string | null } | null = null;
      setNotifications((prev) =>
        prev.map((item) => {
          if (item.id !== id) {
            return item;
          }
          previousState = { seen: item.seen, seenAt: item.seenAt ?? null };
          return {
            ...item,
            seen: true,
            seenAt: item.seenAt ?? new Date().toISOString(),
          };
        })
      );

      try {
        await markNotificationAsRead(token, id);
      } catch (err) {
        console.error("Khong the cap nhat thong bao", err);
        setError("Khong the cap nhat thong bao");
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === id && previousState
              ? {
                  ...item,
                  seen: previousState.seen,
                  seenAt: previousState.seenAt,
                }
              : item
          )
        );
      }
    },
    [token]
  );

  const contextValue = useMemo<NotificationContextValue>(() => {
    const unread = notifications.filter((item) => !item.seen).length;
    return {
      notifications,
      loading,
      error,
      unreadCount: unread,
      refresh: loadNotifications,
      markAsRead,
    };
  }, [notifications, loading, error, loadNotifications, markAsRead]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextValue => {
  const value = useContext(NotificationContext);
  if (!value) {
    throw new Error(
      "useNotifications phai duoc su dung trong NotificationProvider"
    );
  }
  return value;
};
