import { useEffect, useState } from "react";
import client from "../api/client";
import { getToken } from "../api/auth";

export default function App() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    const token = getToken();

    // If no token found, send user to login page
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // Try reaching backend
    client
      .get("/health")
      .then((res) => setStatus(JSON.stringify(res.data)))
      .catch(() => setStatus("backend not reachable"));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Backend Status</h2>
      <pre>{status}</pre>

      <h3>Quick links</h3>
      <p>
        <a href="/upload">Upload</a> |{" "}
        <a href="/share">Share</a> |{" "}
        <a href="/view">View</a> |{" "}
        <a href="/logout">Logout</a>
      </p>
    </div>
  );
}
