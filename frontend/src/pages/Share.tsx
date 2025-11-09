import { useState } from "react";
import client from "../api/client";
import { authHeaders } from "../api/auth";
import DashboardLayout from "../layout/DashboardLayout";

export default function Share() {
  const [recordId, setRecordId] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await client.post(
        "/records/share",
        { recordId, toEmail, wrappedKey: "" },
        { headers: authHeaders() }
      );
      setMsg(res.data?.ok ? `Record shared successfully (Share ID: ${res.data.shareId})` : "Share failed.");
    } catch (e: any) {
      setMsg(e?.response?.data?.error || "Error sharing record.");
    }
  };

  return (
    <DashboardLayout>
      <h2>Share Record</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 400 }}>
        <input
          placeholder="Record ID"
          value={recordId}
          onChange={(e) => setRecordId(e.target.value)}
        />
        <input
          placeholder="Recipient Email"
          value={toEmail}
          onChange={(e) => setToEmail(e.target.value)}
        />
        <button type="submit">Share</button>
      </form>
      <p>{msg}</p>
    </DashboardLayout>
  );
}
