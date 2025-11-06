import { recordLoginAttemptNotification } from "./notification";

const API_BASE =
  (process.env.REACT_APP_API_BASE &&
    process.env.REACT_APP_API_BASE.trim().replace(/\/$/, "")) ||
  "http://localhost:8080";

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
