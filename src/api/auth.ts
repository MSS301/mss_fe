const API_BASE = "http://localhost:8080";

export async function login(
  username: string,
  password: string
): Promise<string> {
  const url = `${API_BASE}/auth-service/auth/token`;
  const body = { username, password };

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

  const data = await resp.json();
  if (data && data.result && data.result.token) return data.result.token;
  throw new Error("Không nhận được token từ server");
}
