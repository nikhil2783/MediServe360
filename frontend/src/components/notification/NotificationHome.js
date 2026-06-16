import { Link, Outlet, useLocation } from "react-router-dom";
import Signout from "../Auth/Signout";

const quickActions = [
  { to: "add",       label: "Add Notification",  icon: "➕" },
  { to: "find",      label: "Get Notification",  icon: "🔍" },
  { to: "findall",   label: "Find All",           icon: "🔔" },
  { to: "paginated", label: "Paginated View",     icon: "📄" },
];

const notificationInfo = [
  {
    icon: "📅",
    title: "Appointment Reminders",
    desc: "Patients and doctors are notified automatically before upcoming appointments to reduce no-shows.",
  },
  {
    icon: "🛏️",
    title: "Bed & Ward Alerts",
    desc: "Nurses receive notifications when a bed is assigned, vacated, or requires maintenance in their ward.",
  },
  {
    icon: "🧾",
    title: "Invoice & Payment Updates",
    desc: "Finance officers and patients are notified when an invoice is generated, approved, or overdue.",
  },
  {
    icon: "🛡️",
    title: "Insurance Claim Status",
    desc: "Relevant staff are alerted when an insurance claim is submitted, approved, or rejected.",
  },
  {
    icon: "⚠️",
    title: "Critical Patient Alerts",
    desc: "Doctors and nurses receive urgent notifications for critical patient status changes requiring immediate attention.",
  },
  {
    icon: "🔐",
    title: "Security & Access Alerts",
    desc: "Admins are notified of suspicious login attempts, role changes, or unauthorized access events in the system.",
  },
];

export default function NotificationHome() {
  const location = useLocation();
  const isHome = location.pathname === "/notification" || location.pathname === "/notification/";

  return (
    <div className="min-vh-100 bg-light">

      {}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/notification">
            🔔 Notifications
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="add">Add Notification</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="find">Get Notification</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="findall">Find All</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="paginated">Notification Pages</Link>
              </li>
            </ul>
          </div>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Signout />
            </li>
          </ul>
        </div>
      </nav>

      {isHome && (
        <div className="container-fluid px-4 py-4">

          {}
          <div
            className="rounded-3 p-4 mb-4 text-white d-flex align-items-center gap-4"
            style={{ background: "linear-gradient(135deg, #1a6e4f 0%, #0d4f3c 100%)" }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 64, height: 64, background: "rgba(255,255,255,0.15)" }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="12" y="4" width="8" height="24" rx="2" fill="white"/>
                <rect x="4" y="12" width="24" height="8" rx="2" fill="white"/>
              </svg>
            </div>
            <div>
              <h4 className="fw-bold mb-1">MediServe360 — Notifications</h4>
              <p className="mb-0 small" style={{ opacity: 0.85 }}>
                Keep every role in the hospital informed in real time. Notifications in MediServe360 are
                category-based and targeted — the right alert reaches the right person at the right time,
                from appointment reminders to critical patient alerts.
              </p>
            </div>
          </div>

          {}
          <div className="row g-3">

            {}
            <div className="col-12 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-bottom py-3">
                  <h6 className="fw-bold mb-0 text-dark">⚡ Quick Actions</h6>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    {quickActions.map((a) => (
                      <div className="col-6" key={a.to}>
                        <Link
                          to={a.to}
                          className="btn btn-outline-dark w-100 py-3 d-flex flex-column align-items-center gap-2 text-decoration-none"
                          style={{ borderRadius: "10px", minHeight: "80px" }}
                        >
                          <span style={{ fontSize: "1.4rem" }}>{a.icon}</span>
                          <span className="small fw-semibold" style={{ fontSize: "0.75rem" }}>{a.label}</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="col-12 col-lg-8">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-bottom py-3">
                  <h6 className="fw-bold mb-0 text-dark">🔔 Notification Types in MediServe360</h6>
                </div>
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    {notificationInfo.map((item) => (
                      <li key={item.title} className="list-group-item border-0 px-3 py-3 d-flex align-items-start gap-3">
                        <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{item.icon}</span>
                        <div>
                          <p className="fw-semibold mb-0 small text-dark">{item.title}</p>
                          <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      <Outlet />
    </div>
  );
}
