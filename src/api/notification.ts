import { DecodedToken, decodeToken } from "../utils/jwt";

const API_BASE =
  (process.env.REACT_APP_API_BASE &&
    process.env.REACT_APP_API_BASE.trim().replace(/\/$/, "")) ||
  "http://localhost:8080";

const NOTIFICATION_BASE = `${API_BASE}/notification-service`;
export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | string;

export interface NotificationRecord {
  id: number;
  userId: string;
  recipientEmail?: string | null;
  title: string;
  message?: string | null;
  type: NotificationType;
  event?: string | null;
  link?: string | null;
  seen: boolean;
  createdAt: string;
  seenAt?: string | null;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface CreateNotificationPayload {
  userId: string;
  recipientEmail?: string | null;
  title: string;
  message?: string | null;
  type: NotificationType;
  event?: string | null;
  link?: string | null;
}

const buildHeaders = (token?: string, withJson = false): HeadersInit => {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (withJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function createNotification(
  payload: CreateNotificationPayload,
  token?: string
): Promise<NotificationRecord> {
  const response = await fetch(`${NOTIFICATION_BASE}/api/notifications`, {
    method: "POST",
    headers: buildHeaders(token, true),
    body: JSON.stringify(payload),
  });

  return handleResponse<NotificationRecord>(response);
}

export async function fetchUserNotifications(
  token: string,
  userId: string,
  page = 0,
  size = 20
): Promise<PaginatedResponse<NotificationRecord>> {
  const response = await fetch(
    `${NOTIFICATION_BASE}/api/notifications/user/${userId}/paged?page=${page}&size=${size}`,
    {
      headers: buildHeaders(token),
    }
  );

  return handleResponse<PaginatedResponse<NotificationRecord>>(response);
}

export async function fetchAllNotifications(
  token: string,
  page = 0,
  size = 20
): Promise<PaginatedResponse<NotificationRecord>> {
  const response = await fetch(
    `${NOTIFICATION_BASE}/api/notifications?page=${page}&size=${size}`,
    {
      headers: buildHeaders(token),
    }
  );

  return handleResponse<PaginatedResponse<NotificationRecord>>(response);
}

export async function markNotificationAsRead(
  token: string,
  id: number
): Promise<void> {
  const response = await fetch(
    `${NOTIFICATION_BASE}/api/notifications/${id}/mark-as-read`,
    {
      method: "POST",
      headers: buildHeaders(token),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
}

export interface LoginAttemptPayload {
  email: string;
  status: "success" | "failure";
  token?: string;
  errorMessage?: string;
}

const FALLBACK_USER_ID =
  process.env.REACT_APP_NOTIFICATION_FALLBACK_USER_ID?.trim() ?? "";

export async function recordLoginAttemptNotification(
  payload: LoginAttemptPayload
): Promise<void> {
  const createdAt = new Date().toISOString();
  let userId = FALLBACK_USER_ID;

  if (payload.token) {
    const decoded: DecodedToken | null = decodeToken(payload.token);
    if (decoded?.sub) {
      userId = decoded.sub;
    }
  }

  if (!userId) {
    console.warn("Skipping notification creation due to missing userId");
    return;
  }

  const title =
    payload.status === "success"
      ? "Dang nhap thanh cong"
      : "Dang nhap that bai";

  const messageBody =
    payload.status === "success"
      ? `Tai khoan ${payload.email} da dang nhap luc ${new Date(
          createdAt
        ).toLocaleString()}`
      : `Dang nhap that bai cho tai khoan ${payload.email}${
          payload.errorMessage ? `: ${payload.errorMessage}` : ""
        }`;

  const notificationPayload: CreateNotificationPayload = {
    userId,
    recipientEmail: payload.email,
    title,
    message: messageBody,
    type: payload.status === "success" ? "success" : "warning",
    event:
      payload.status === "success"
        ? "AUTH_LOGIN_SUCCESS"
        : "AUTH_LOGIN_FAILURE",
  };

  try {
    await createNotification(notificationPayload);
  } catch (error) {
    console.error("Failed to record login attempt notification", error);
  }
}
