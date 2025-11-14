import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Upload from "./pages/Upload";
import Share from "./pages/Share";
import View from "./pages/View";
import Logout from "./pages/Logout";

// layout
import DashboardLayout from "./layout/DashboardLayout";

// styles
import "./index.css";

/* ---------- Auth Guard ---------- */
function RequireAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

/* ---------- Routes ---------- */
const router = createBrowserRouter([
  // Public routes
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot", element: <Forgot /> },

  // LOGOUT ROUTE (fix)
  { path: "/logout", element: <Logout /> },

  // Protected dashboard routes
  {
    path: "/",
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <View /> },
      { path: "view", element: <View /> },
      { path: "upload", element: <Upload /> },
      { path: "share", element: <Share /> },
    ],
  },

  // Fallback
  { path: "*", element: <Navigate to="/" replace /> },
]);

/* ---------- Render ---------- */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
