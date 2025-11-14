import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
        setMsg("2FA code sent.");
      } else {
        setMsg(res?.error || "Invalid login.");
      }
    } catch {
      setMsg("Login error.");
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
        setMsg(res?.error || "2FA failed.");
      }
    } catch {
      setMsg("2FA error.");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f0f2f5"
    }}>
      <div style={{
        background: "#fff",
        padding: 30,
        borderRadius: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        width: "100%",
        maxWidth: 380
      }}>

        <h2 style={{ textAlign: "center" }}>Login</h2>

        {stage === 1 ? (
          <form onSubmit={submitCreds} style={{ display: "grid", gap: 10 }}>
            <input placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)} />

            <input placeholder="Password" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)} />

            <button type="submit">Continue</button>

            <p style={{ color: "red" }}>{msg}</p>

            <Link to="/register">Register</Link>
            <Link to="/forgot">Forgot Password?</Link>
          </form>
        ) : (
          <form onSubmit={submitCode} style={{ display: "grid", gap: 10 }}>
            <input placeholder="2FA Code" value={code}
              onChange={(e) => setCode(e.target.value)} />

            <button type="submit">Verify</button>

            <p style={{ color: "red" }}>{msg}</p>
          </form>
        )}

      </div>
    </div>
  );
}
