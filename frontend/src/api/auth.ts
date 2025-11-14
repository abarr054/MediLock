// frontend/src/api/auth.ts

import client from "./client";

// Login
export async function login(email: string, password: string) {
  try {
    const res = await client.post("/auth/login", { email, password });
    return res.data;
  } catch (err: any) {
    return err?.response?.data || { ok: false };
  }
}

// 2FA verify
export async function verify2fa(email: string, code: string) {
  try {
    const res = await client.post("/auth/verify2fa", { email, code });
    return res.data;
  } catch (err: any) {
    return err?.response?.data || { ok: false };
  }
}

// Password Reset Request  ❗ (this was missing)
export async function requestPasswordReset(email: string) {
  try {
    const res = await client.post("/auth/request-reset", { email });
    return res.data;
  } catch (err: any) {
    return err?.response?.data || { ok: false };
  }
}

// Authorization header
export function authHeaders() {
  const token = localStorage.getItem("token") || "";
  return { Authorization: `Bearer ${token}` };
}

// Get token
export function getToken() {
  return localStorage.getItem("token");
}

// Clear token (fixes logout)
export function clearToken() {
  localStorage.removeItem("token");
}
