// frontend/src/pages/Reset.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/auth";

export default function Reset() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      const r = await resetPassword(email, code, newPassword);
      if (r?.ok) {
        setMsg("Password updated. Redirecting to login...");
        setTimeout(() => nav("/login"), 1000);
      } else {
        setMsg(r?.error || "Reset failed.");
      }
    } catch (e: any) {
      setMsg(e?.response?.data?.error || "Reset error.");
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "Segoe UI, Arial" }}>
      <h1>Reset password</h1>
      <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 360 }}>
        <input
          type="email"
          placeholder="Account email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Reset code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Update password</button>
      </form>
      <p style={{ color: "crimson" }}>{msg}</p>
      <p style={{ marginTop: 12 }}>
        Back to <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
