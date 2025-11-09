import client from "./client";

// keep token in localStorage like before
export function setToken(t: string) {
  localStorage.setItem("token", t);
}
export function getToken(): string {
  return localStorage.getItem("token") || "";
}
export function clearToken() {
  localStorage.removeItem("token");
}
export function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// ----- auth calls -----
export async function register(email: string, password: string) {
  const res = await client.post("/auth/register", { email, password });
  return res.data as { ok: boolean; error?: string };
}

export async function login(email: string, password: string) {
  const res = await client.post("/auth/login", { email, password });
  return res.data as { ok: boolean; error?: string };
}

export async function verify2fa(email: string, code: string) {
  const res = await client.post("/auth/verify2fa", { email, code });
  const data = res.data as { ok: boolean; token?: string; error?: string };
  if (data.ok && data.token) setToken(data.token);
  return data;
}

export async function me() {
  const res = await client.get("/auth/me", { headers: authHeaders() });
  return res.data as { ok: boolean; user?: { email: string }; error?: string };
}

// ----- password reset -----
export async function requestReset(email: string) {
  const res = await client.post("/auth/request-reset", { email });
  return res.data as { ok: boolean; error?: string };
}

// Some pages may be importing this name; make it alias to avoid white screens
export const requestPasswordReset = requestReset;

export async function resetPassword(email: string, code: string, newPassword: string) {
  const res = await client.post("/auth/reset-password", { email, code, newPassword });
  return res.data as { ok: boolean; error?: string };
}
