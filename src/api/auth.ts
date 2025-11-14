import { recordLoginAttemptNotification } from "./notification";

const API_BASE =
  (process.env.REACT_APP_API_BASE &&
    process.env.REACT_APP_API_BASE.trim().replace(/\/$/, "")) ||
  "http://localhost:8080";

export function resolveAvatarUrl(url?: string | null): string | null {
  if (!url) return null;
  
  // Base64 data URL -> use as-is
  if (url.startsWith("data:")) return url;
  
  // Absolute URL -> use as-is
  if (/^https?:\/\//i.test(url)) return url;

  // Relative or absolute-path on server -> prefix with API_BASE
  if (url.startsWith("/")) {
    return `${API_BASE}${url}`;
  }

  // Other relative paths
  return `${API_BASE}/${url.replace(/^\/?/, "")}`;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  code: number;
  result: {
    id: string;
    username: string;
    email: string;
    emailVerified: boolean;
    avatarUrl: string | null;
    authProvider: string;
    roles: Array<{
      name: string;
      description: string;
    }>;
  };
}

export interface LoginResponse {
  code: number;
  result: {
    token: string;
    expiryTime: string;
  };
}

export interface GoogleAuthRequest {
  googleId: string;
  email: string;
  name: string;
  picture: string;
}

export interface UserProfileResult {
  id: number;
  accountId: string;
  schoolId?: number | null;
  schoolName?: string | null;
  fullName?: string | null;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
  role?: string | null;
  teacherProofUrl?: string | null;
  teacherProofVerified?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface UserProfileResponse {
  code: number;
  message?: string;
  result?: UserProfileResult | null;
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  const url = `${API_BASE}/auth-service/users`;
  const body: RegisterRequest = { username, email, password };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  return resp.json();
}

export async function login(email: string, password: string): Promise<string> {
  const url = `${API_BASE}/auth-service/auth/token`;
  const body = { email, password };

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const text = await resp.text();
      await recordLoginAttemptNotification({
        email,
        status: "failure",
        errorMessage: text || `HTTP ${resp.status}`,
      });
      throw new Error(`HTTP ${resp.status}: ${text}`);
    }

    const data: LoginResponse = await resp.json();
    if (data?.result?.token) {
      await recordLoginAttemptNotification({
        email,
        status: "success",
        token: data.result.token,
      });
      return data.result.token;
    }

    await recordLoginAttemptNotification({
      email,
      status: "failure",
      errorMessage: "Token missing in response",
    });
    throw new Error("Token missing in response");
  } catch (error) {
    if (error instanceof Error && !error.message.startsWith("HTTP")) {
      await recordLoginAttemptNotification({
        email,
        status: "failure",
        errorMessage: error.message,
      });
    }
    throw error;
  }
}

export function loginWithGoogle(): void {
  window.location.href = `${API_BASE}/auth-service/auth/google`;
}

export async function googleAuth(
  googleId: string,
  email: string,
  name: string,
  picture: string
): Promise<string> {
  const url = `${API_BASE}/auth-service/auth/google`;
  const body: GoogleAuthRequest = { googleId, email, name, picture };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: LoginResponse = await resp.json();
  if (data?.result?.token) {
    return data.result.token;
  }
  throw new Error("Token missing in response");
}

export async function logout(token: string): Promise<void> {
  const url = `${API_BASE}/auth-service/auth/logout`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
}

export async function getCurrentUserProfile(
  token: string
): Promise<UserProfileResult | null> {
  const url = `${API_BASE}/auth-service/user-profiles/me`;

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    // If 404 or other, return null so caller can handle 'no profile' case
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: UserProfileResponse = await resp.json();
  return data.result || null;
}

export interface UserApiResult {
  code: number;
  message?: string;
  result?: {
    id: string;
    username?: string | null;
    email?: string | null;
    emailVerified?: boolean;
    avatarUrl?: string | null;
    authProvider?: string | null;
    roles?: Array<{ name: string; description?: string }>;
  } | null;
}

export async function getUserById(token: string, id: string) {
  const url = `${API_BASE}/auth-service/users/${encodeURIComponent(id)}`;

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: UserApiResult = await resp.json();
  return data.result || null;
}

export async function createSelfUserProfile(
  token: string,
  formData: FormData
): Promise<UserProfileResult> {
  const url = `${API_BASE}/auth-service/user-profiles/me`;
  if (!token) {
    console.error("createSelfUserProfile: missing bearer token");
    throw new Error("Bearer token is required");
  }

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      // Do NOT set Content-Type; browser will set multipart boundary
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const text = await resp.text();
  let data: UserProfileResponse | null = null;
  try {
    data = text ? (JSON.parse(text) as UserProfileResponse) : null;
  } catch (e) {
    console.error("createSelfUserProfile: failed to parse JSON response", { status: resp.status, text });
  }

  if (!resp.ok) {
    console.error("createSelfUserProfile: HTTP error", { status: resp.status, body: text });
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  if (!data || !data.result) throw new Error("Empty response from server");
  return data.result;
}

export async function updateSelfUserProfile(
  token: string,
  formData: FormData
): Promise<UserProfileResult> {
  const url = `${API_BASE}/auth-service/user-profiles/me`;
  if (!token) {
    console.error("updateSelfUserProfile: missing bearer token");
    throw new Error("Bearer token is required");
  }

  const resp = await fetch(url, {
    method: "PUT",
    headers: {
      // Do NOT set Content-Type; browser will set multipart boundary
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const text = await resp.text();
  let data: UserProfileResponse | null = null;
  try {
    data = text ? (JSON.parse(text) as UserProfileResponse) : null;
  } catch (e) {
    console.error("updateSelfUserProfile: failed to parse JSON response", { status: resp.status, text });
  }

  if (!resp.ok) {
    console.error("updateSelfUserProfile: HTTP error", { status: resp.status, body: text });
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  if (!data || !data.result) throw new Error("Empty response from server");
  return data.result;
}

export interface SchoolResult {
  id: number;
  name: string;
  address?: string | null;
}

export interface PaginatedList<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export async function getSchools(
  token: string | undefined,
  page = 0,
  size = 25,
  sort = "desc"
): Promise<PaginatedList<SchoolResult>> {
  // Spring Data expects sort param as property[,direction] e.g. sort=id,desc
  const sortParam = `id,${sort}`;
  const url = `${API_BASE}/auth-service/schools?page=${page}&size=${size}&sort=${encodeURIComponent(
    sortParam
  )}`;

  if (!token) {
    console.error("getSchools: missing bearer token");
    throw new Error("Bearer token is required to call getSchools");
  }

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    console.error(`getSchools failed: HTTP ${resp.status}: ${text}`);
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size,
      number: page,
      first: true,
      last: true,
    } as PaginatedList<SchoolResult>;
  }

  const data = await resp.json();
  // Backend returns { content: [...], pagination: { page, size, totalElements, totalPages, first, last, ... } }
  const content: SchoolResult[] = data.content || [];
  const meta = data.pagination || {};

  return {
    content,
    totalElements: meta.totalElements || 0,
    totalPages: meta.totalPages || 0,
    size: meta.size || size,
    number: meta.page || page,
    first: !!meta.first,
    last: !!meta.last,
  } as PaginatedList<SchoolResult>;
}

// ==================== Admin Teacher Verification APIs ====================

export async function getProfilesWithTeacherProof(
  token: string,
  page: number = 0,
  size: number = 20
): Promise<PaginatedList<UserProfileResult>> {
  const url = `${API_BASE}/auth-service/user-profiles/teacher-proofs?page=${page}&size=${size}&sort=createdAt,desc`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data = await resp.json();
  const content: UserProfileResult[] = data.content || [];
  const meta = data.pagination || {};

  return {
    content,
    totalElements: meta.totalElements || 0,
    totalPages: meta.totalPages || 0,
    size: meta.size || size,
    number: meta.page || page,
    first: !!meta.first,
    last: !!meta.last,
  } as PaginatedList<UserProfileResult>;
}

export async function getAllPendingTeacherProfiles(
  token: string,
  page: number = 0,
  size: number = 20
): Promise<PaginatedList<UserProfileResult>> {
  const url = `${API_BASE}/auth-service/user-profiles?teacherProofVerified=FALSE&page=${page}&size=${size}&sort=createdAt,desc`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data = await resp.json();
  const content: UserProfileResult[] = data.content || [];
  const meta = data.pagination || {};

  return {
    content,
    totalElements: meta.totalElements || 0,
    totalPages: meta.totalPages || 0,
    size: meta.size || size,
    number: meta.page || page,
    first: !!meta.first,
    last: !!meta.last,
  } as PaginatedList<UserProfileResult>;
}

export async function promoteToTeacher(
  token: string,
  userId: string
): Promise<void> {
  const url = `${API_BASE}/auth-service/users/${userId}/promote/teacher`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
}

export async function verifyTeacherProof(
  token: string,
  profileId: number
): Promise<UserProfileResult> {
  const url = `${API_BASE}/auth-service/user-profiles/${profileId}`;
  const resp = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ teacherProofVerified: true }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: UserProfileResponse = await resp.json();
  if (!data.result) throw new Error("Empty response");
  return data.result;
}
