// frontend/src/pages/Forgot.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../api/auth";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    const res = await requestPasswordReset(email);

    if (res?.ok) {
      setMsg("A password reset link has been sent if this email exists.");
    } else {
      setMsg(res?.error || "Unable to send reset request.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f0f2f5",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: 380,
        }}
      >
        <h2 style={{ textAlign: "center" }}>Reset Password</h2>

        <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
          <input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />

          <button
            type="submit"
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "none",
              background: "#0ea5e9",
              color: "white",
              cursor: "pointer",
            }}
          >
            Request Reset
          </button>

          <p style={{ color: "crimson", textAlign: "center" }}>{msg}</p>

          <p style={{ textAlign: "center", marginTop: 6 }}>
            <Link to="/login">Back to Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
