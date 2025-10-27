const API_BASE = "http://localhost:8080";

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

  const data = await resp.json();
  return data;
}

export async function login(email: string, password: string): Promise<string> {
  const url = `${API_BASE}/auth-service/auth/token`;
  const body = { email, password };

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
  if (data && data.result && data.result.token) return data.result.token;
  throw new Error("Không nhận được token từ server");
}

export function loginWithGoogle(): void {
  // Redirect to Google OAuth endpoint
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
  if (data && data.result && data.result.token) return data.result.token;
  throw new Error("Không nhận được token từ server");
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
