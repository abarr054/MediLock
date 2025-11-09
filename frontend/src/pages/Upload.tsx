// frontend/src/pages/Upload.tsx
import { useState } from "react";
import client from "../api/client";
import { authHeaders } from "../api/auth";
import DashboardLayout from "../layout/DashboardLayout";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");

  const toBase64 = (f: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve((r.result as string).split(",")[1]);
      r.onerror = reject;
      r.readAsDataURL(f);
    });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    if (!file) return setMsg("Please select a file first.");
    try {
      const dataB64 = await toBase64(file);
      const res = await client.post(
        "/records/upload",
        { fileName: file.name, mimeType: file.type, dataB64 },
        { headers: authHeaders() }
      );
      setMsg(res.data?.ok ? `Uploaded successfully. ID: ${res.data.id}` : "Upload failed.");
    } catch (err: any) {
      setMsg(err?.response?.data?.error || "Error uploading file.");
    }
  };

  return (
    <DashboardLayout>
      <h2>Upload Medical Record</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 400 }}>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button type="submit">Upload</button>
      </form>
      <p>{msg}</p>
    </DashboardLayout>
  );
}
