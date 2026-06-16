import { Link } from "react-router";
import Signout from "../Auth/Signout";

const navLinks = [
  { to: "/bed", label: "Bed", icon: "🛏️" },
  { to: "/ward", label: "Ward", icon: "🏨" },
];

export default function NurseDD() {
  return (
    <div className="min-vh-100 bg-light">

      {}
      <nav className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold fs-5">🏥 Nurse Portal</span>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Signout />
            </li>
          </ul>
        </div>
      </nav>

      {}
      <div className="container py-5">

        {}
        <div className="text-center mb-5">
          <h3 className="fw-bold text-dark mb-1">Nurse Dashboard</h3>
          <p className="text-muted small">Select a module to manage</p>
        </div>

        {}
        <div className="row g-3 justify-content-center">
          {navLinks.map((link) => (
            <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={link.to}>
              <Link
                to={link.to}
                className="btn btn-outline-dark w-100 py-3 d-flex flex-column align-items-center gap-2 text-decoration-none"
                style={{ borderRadius: "10px", minHeight: "90px" }}
              >
                <span style={{ fontSize: "1.6rem" }}>{link.icon}</span>
                <span className="small fw-semibold" style={{ fontSize: "0.78rem" }}>{link.label}</span>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
