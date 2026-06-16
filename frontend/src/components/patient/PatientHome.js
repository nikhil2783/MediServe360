import { Link, Outlet, useLocation } from "react-router-dom";
import TopNavbar from "../common/TopNavbar";

const navLinks = [
  { to: "add", label: "Add Patient", icon: "➕" },
  { to: "find", label: "Find Patient", icon: "🔍" },
  { to: "display", label: "Display", icon: "📋" },
  { to: "displayPaginated", label: "Paginated", icon: "📄" },
  { to: "patientnotificaion", label: "Notification", icon: "🔔" }
];

export default function PatientHome() {
  const location = useLocation();
  return (
    <div className="min-vh-100 bg-light">
      <TopNavbar />

      <div className="container-fluid px-4 py-4">

        <div className="mb-4">
          <Link to="/patient" className="text-decoration-none">
            <h4 className="fw-bold text-dark mb-1">Patient Management</h4>
          </Link>
          <p className="text-muted small mb-0">
            Manage patients · Records · Medical history
          </p>
        </div>

        {}
        <div className="row g-3 mb-4">

          {navLinks.map((link) => (
            <div className="col" key={link.to}>
              <Link
                to={link.to}
                className="btn btn-outline-dark w-100 py-4 d-flex flex-column align-items-center gap-2 text-decoration-none"
                style={{ borderRadius: "12px", minHeight: "100px" }}
              >
                <span style={{ fontSize: "1.8rem" }}>{link.icon}</span>
                <span className="fw-semibold small">{link.label}</span>
              </Link>
            </div>
          ))}
        </div>

        {!location.pathname.startsWith("/patient/") ? (
          <div className="card shadow-sm p-4 text-muted text-center">
            <h6 className="mb-2">Welcome to Patient Module</h6>
            <p className="mb-0">Select an option above to continue</p>
          </div>
        ) : (
          <div className="card shadow-sm">
            <div className="card-body">
              <Outlet />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}