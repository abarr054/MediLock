import { useEffect, useState } from "react";
import client from "../api/client";
import DashboardLayout from "../layout/DashboardLayout";

export default function App() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    client
      .get("/health")
      .then((res) => setStatus(JSON.stringify(res.data)))
      .catch(() => setStatus("backend not reachable"));
  }, []);

  return (
    <DashboardLayout>
      <h2>Backend Status</h2>
      <pre>{status}</pre>

      <h3>Quick links</h3>
      <p>
        <a href="/upload">Upload</a> | <a href="/share">Share</a> |{" "}
        <a href="/view">View</a> | <a href="/logout">Logout</a>
      </p>
    </DashboardLayout>
  );
}
