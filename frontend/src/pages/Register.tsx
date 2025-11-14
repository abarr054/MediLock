import { useState } from "react";
import client from "../api/client";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await client.post("/auth/register", { email, password, role: "patient" });
      if (res.data?.ok) setMsg("Registered. You can login now.");
      else setMsg("Failed.");
    } catch (e: any) {
      setMsg(e?.response?.data?.error || "Error");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Register</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
        <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Create account</button>
      </form>
      <p>{msg}</p>
      <p><a href="/login">Go to Login</a></p>
    </div>
  );
}