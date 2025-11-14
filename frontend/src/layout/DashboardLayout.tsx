import { Link, useLocation, Outlet } from "react-router-dom";
import "./dashboard.css";

export default function DashboardLayout() {
  const loc = useLocation();
  const active = (p: string) => (loc.pathname === p ? "active" : "");

  return (
    <div className="dash-wrap">
      <aside className="dash-nav">
        <div className="brand">MediLock</div>

        <nav>
          <Link className={active("/")} to="/">Home</Link>
          <Link className={active("/upload")} to="/upload">Upload</Link>
          <Link className={active("/share")} to="/share">Share</Link>
          <Link className={active("/view")} to="/view">View</Link>
          <Link className={active("/logout")} to="/logout">Logout</Link>
        </nav>
      </aside>

      <main className="dash-main">
        <header className="dash-top">Secure Record Sharing</header>

        <section className="dash-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
