// frontend/src/pages/Forgot.tsx
import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { requestPasswordReset, resetPassword } from "../api/auth";
import { Link } from "react-router-dom";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await requestPasswordReset(email);
      if (res?.ok) {
        setSent(true);
        setMsg("Reset code sent. Check your email or server console.");
      } else {
        setMsg(res?.error || "Could not send reset code.");
      }
    } catch (err: any) {
      setMsg(err?.response?.data?.error || "Error sending reset code.");
    }
  };

  const doReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await resetPassword(email, code, newPassword);
      if (res?.ok) {
        setMsg("Password updated. You can login now.");
      } else {
        setMsg(res?.error || "Could not reset password.");
      }
    } catch (err: any) {
      setMsg(err?.response?.data?.error || "Error resetting password.");
    }
  };

  return (
    <DashboardLayout>
      <h2>Password reset</h2>

      {!sent ? (
        <form onSubmit={send} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
          <input
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Send reset code</button>
          <p style={{ color: "crimson" }}>{msg}</p>
          <p><Link to="/login">Back to Login</Link></p>
        </form>
      ) : (
        <form onSubmit={doReset} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
          <input disabled value={email} />
          <input
            placeholder="Reset code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            placeholder="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit">Update password</button>
          <p style={{ color: "crimson" }}>{msg}</p>
          <p><Link to="/login">Back to Login</Link></p>
        </form>
      )}
    </DashboardLayout>
  );
}
