import { useEffect, useState } from "react";
import client from "../api/client";
import { authHeaders } from "../api/auth";

type Rec = { _id: string; fileName: string; size: number; createdAt?: string };
type ShareRow = { id: string; fileName: string; fromEmail?: string; createdAt?: string };

export default function View() {
  const [mine, setMine] = useState<Rec[]>([]);
  const [shared, setShared] = useState<ShareRow[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    client
      .get("/records/mine", { headers: authHeaders() })
      .then((res) => setMine(res.data.records || []))
      .catch(() => setMsg("Could not load your records."));

    client
      .get("/records/shared-with-me", { headers: authHeaders() })
      .then((res) => setShared(res.data.shares || []));
  }, []);

  const fmtDate = (s?: string) =>
    s ? new Date(s).toLocaleString() : "";

  const fmtSize = (n?: number) => {
    if (!n) return "";
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
    if (n < 1024 * 1024 * 1024) return (n / 1024 / 1024).toFixed(1) + " MB";
    return (n / 1024 / 1024 / 1024).toFixed(1) + " GB";
  };

  const download = async (id: string, suggestedName?: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/records/${id}`, {
        headers: authHeaders() as HeadersInit,
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = suggestedName || "record";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMsg("Error downloading file.");
    }
  };

  return (
    <>
      <h2>My Records</h2>

      {mine.length === 0 ? (
        <p>No records yet.</p>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ padding: 8 }}>File</th>
              <th style={{ padding: 8 }}>Size</th>
              <th style={{ padding: 8 }}>Created</th>
              <th style={{ padding: 8 }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {mine.map((r) => (
              <tr key={r._id}>
                <td style={{ padding: 8 }}>{r.fileName}</td>
                <td style={{ padding: 8 }}>{fmtSize(r.size)}</td>
                <td style={{ padding: 8 }}>{fmtDate(r.createdAt)}</td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => download(r._id, r.fileName)}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p>{msg}</p>

      <h2 style={{ marginTop: 30 }}>Shared With Me</h2>

      {shared.length === 0 ? (
        <p>No shared items.</p>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ padding: 8 }}>File</th>
              <th style={{ padding: 8 }}>From</th>
              <th style={{ padding: 8 }}>Share ID</th>
              <th style={{ padding: 8 }}>Date</th>
            </tr>
          </thead>

          <tbody>
            {shared.map((s) => (
              <tr key={s.id}>
                <td style={{ padding: 8 }}>{s.fileName}</td>
                <td style={{ padding: 8 }}>{s.fromEmail}</td>
                <td style={{ padding: 8 }}>{s.id}</td>
                <td style={{ padding: 8 }}>{fmtDate(s.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
