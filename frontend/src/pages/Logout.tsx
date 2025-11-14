// frontend/src/pages/Logout.tsx

import { useEffect } from "react";
import { clearToken } from "../api/auth";

export default function Logout() {
  useEffect(() => {
    clearToken();                 // delete the token
    window.location.href = "/login"; // redirect to login page
  }, []);

  return null;
}
