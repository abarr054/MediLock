import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// ---- Pages ----
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Upload from "./pages/Upload";
import Share from "./pages/Share";
import View from "./pages/View";

// ---- Layout ----
import DashboardLayout from "./layout/DashboardLayout";

// ---- Styles ----
import "./index.css";

/* ---------- Auth wrapper ---------- */
function RequireAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

/* ---------- App routes ---------- */
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <DashboardLayout>
          <View />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot",
    element: <Forgot />,
  },
  {
    path: "/upload",
    element: (
      <RequireAuth>
        <DashboardLayout>
          <Upload />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/share",
    element: (
      <RequireAuth>
        <DashboardLayout>
          <Share />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/view",
    element: (
      <RequireAuth>
        <DashboardLayout>
          <View />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  // fallback
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

/* ---------- Render ---------- */
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
