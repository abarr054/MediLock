// frontend/src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { login, verify2fa } from "../api/auth";

export default function Login() {
  const nav = useNavigate();
  const [stage, setStage] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const submitCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await login(email, password);
      if (res?.ok) {
        setStage(2);
        setMsg("2FA code sent. Check email or server console.");
      } else {
        setMsg(res?.error || "Invalid credentials.");
      }
    } catch (err: any) {
      setMsg(err?.response?.data?.error || "Login error.");
    }
  };

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await verify2fa(email, code);
      if (res?.ok && res?.token) {
        localStorage.setItem("token", res.token);
        nav("/");
      } else {
        setMsg(res?.error || "2FA verification failed.");
      }
    } catch (err: any) {
      setMsg(err?.response?.data?.error || "2FA error.");
    }
  };

  return (
    <DashboardLayout>
      <h2>Login</h2>

      {stage === 1 ? (
        <form onSubmit={submitCreds} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Continue</button>
          <p style={{ color: "crimson" }}>{msg}</p>
          <p style={{ marginTop: 16 }}>
            Need an account? <Link to="/register">Register</Link>
          </p>
          <p style={{ marginTop: 12 }}>
            Forgot your password? <Link to="/forgot">Reset it</Link>
          </p>
        </form>
      ) : (
        <form onSubmit={submitCode} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
          <input
            placeholder="2FA code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit">Verify code</button>
          <p style={{ color: "crimson" }}>{msg}</p>
          <p style={{ marginTop: 12 }}>
            Need an account? <Link to="/register">Register</Link>
          </p>
          <p style={{ marginTop: 12 }}>
            Forgot your password? <Link to="/forgot">Reset it</Link>
          </p>
        </form>
      )}
    </DashboardLayout>
  );
}
