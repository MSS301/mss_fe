const API_BASE = "http://localhost:8080/mindmap-service/api/mindmaps";

export interface MindmapSummary {
  id: string;
  userId: string;
  name?: string;
  prompt: string;
  project?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  filename?: string;
}

export interface MindmapResponse {
  metadata: MindmapSummary;
  mindmap?: unknown;
}

export interface CreateMindmapPayload {
  userId: string;
  prompt: string;
  name?: string;
  project?: string;
}

export interface UpdateMindmapPayload {
  prompt?: string;
  name?: string;
  project?: string;
}

function authHeaders(token: string, userId: string) {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "X-User-Id": userId,
  };
}

type ApiError = Error & { status?: number; body?: string };

async function throwApiError(resp: Response): Promise<never> {
  const bodyText = await resp.text();
  const error: ApiError = new Error(
    `HTTP ${resp.status}: ${bodyText || resp.statusText}`
  );
  error.status = resp.status;
  error.body = bodyText;
  throw error;
}

async function handleJsonResponse<T>(resp: Response): Promise<T> {
  if (!resp.ok) {
    return throwApiError(resp);
  }
  return resp.json() as Promise<T>;
}

export async function listUserMindmaps(
  token: string,
  userId: string
): Promise<MindmapSummary[]> {
  const resp = await fetch(`${API_BASE}/users/${userId}`, {
    headers: authHeaders(token, userId),
  });
  return handleJsonResponse<MindmapSummary[]>(resp);
}

export async function getMindmapDetail(
  token: string,
  userId: string,
  mindmapId: string
): Promise<MindmapResponse> {
  const resp = await fetch(`${API_BASE}/users/${userId}/${mindmapId}`, {
    headers: authHeaders(token, userId),
  });
  return handleJsonResponse<MindmapResponse>(resp);
}

export async function createMindmap(
  token: string,
  payload: CreateMindmapPayload
): Promise<MindmapResponse> {
  const resp = await fetch(API_BASE, {
    method: "POST",
    headers: {
      ...authHeaders(token, payload.userId),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleJsonResponse<MindmapResponse>(resp);
}

export async function updateMindmap(
  token: string,
  userId: string,
  mindmapId: string,
  payload: UpdateMindmapPayload
): Promise<MindmapResponse> {
  const resp = await fetch(`${API_BASE}/users/${userId}/${mindmapId}`, {
    method: "PUT",
    headers: {
      ...authHeaders(token, userId),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleJsonResponse<MindmapResponse>(resp);
}

export async function deleteMindmap(
  token: string,
  userId: string,
  mindmapId: string
): Promise<void> {
  const resp = await fetch(`${API_BASE}/users/${userId}/${mindmapId}`, {
    method: "DELETE",
    headers: authHeaders(token, userId),
  });
  if (!resp.ok) {
    await throwApiError(resp);
  }
}

export async function triggerMindmapNotification(
  token: string,
  userId: string,
  mindmapId: string
): Promise<void> {
  const resp = await fetch(
    `${API_BASE}/users/${userId}/${mindmapId}/notify`,
    {
      method: "POST",
      headers: authHeaders(token, userId),
    }
  );
  if (!resp.ok) {
    await throwApiError(resp);
  }
}
