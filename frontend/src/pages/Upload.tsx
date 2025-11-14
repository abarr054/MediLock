import { useState } from "react";
import client from "../api/client";
import { authHeaders } from "../api/auth";

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
    if (!file) return setMsg("No file selected.");

    try {
      const dataB64 = await toBase64(file);
      const res = await client.post(
        "/records/upload",
        { fileName: file.name, mimeType: file.type, dataB64 },
        { headers: authHeaders() }
      );
      setMsg(`Uploaded! ID: ${res.data.id}`);
    } catch {
      setMsg("Upload error.");
    }
  };

  return (
    <>
      <h2>Upload Medical Record</h2>

      <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 400 }}>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button type="submit">Upload</button>
      </form>

      <p>{msg}</p>
    </>
  );
}
