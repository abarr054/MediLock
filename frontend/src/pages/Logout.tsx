import { useEffect } from "react";
import { clearToken } from "../api/auth";

export default function Logout() {
  useEffect(() => {
    clearToken();
    window.location.href = "/login";
  }, []);
  return null;
}
