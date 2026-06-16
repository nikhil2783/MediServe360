// src/components/Ward/WardHome.jsx
import { Link, Outlet, useLocation } from "react-router-dom";
import TopNavbar from "../common/TopNavbar";

const navLinks = [
    { to: "add",       label: "Add Ward",         biClass: "bi-plus-circle-fill",      color: "#6f42c1" },
    { to: "find",      label: "Find Ward",        biClass: "bi-search",                color: "#0d6efd" },
    { to: "findAll",   label: "All Wards",        biClass: "bi-building",              color: "#0dcaf0" },
    { to: "occupancy", label: "Occupancy Report", biClass: "bi-bar-chart-fill",        color: "#198754" },
    { to: "pages",     label: "Pages",            biClass: "bi-file-earmark-text-fill",color: "#6c757d" },
];

export default function WardHome() {
    const location = useLocation();

    return (
        <div className="min-vh-100 bg-light">
            <TopNavbar />

            <div className="container-fluid px-4 py-4">

                {}
                <div className="d-flex align-items-start justify-content-between mb-4">
                    <div>
                        <Link to="/ward" className="text-decoration-none">
                            <h4 className="fw-bold text-dark mb-1">Ward Management</h4>
                        </Link>
                        <p className="text-muted small mb-0">Manage wards · Occupancy · Reports</p>
                    </div>

                    {}
                    <Link
                        to="/nursedd/dashboard"
                        className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 shadow-sm"
                        style={{ borderRadius: "10px", fontSize: "0.875rem", fontWeight: "500" }}
                    >
                        <i className="bi bi-grid-fill" style={{ fontSize: "1rem" }}></i>
                        Nurse Dashboard
                        <i className="bi bi-arrow-right" style={{ fontSize: "0.85rem" }}></i>
                    </Link>
                </div>

                {}
                <div className="row g-3 mb-4">
                    {navLinks.map((link) => (
                        <div className="col-6 col-md-4" key={link.to}>
                            <Link
                                to={link.to}
                                className="btn btn-outline-secondary w-100 py-4 d-flex flex-column align-items-center gap-2 text-decoration-none"
                                style={{ borderRadius: "12px", minHeight: "110px", border: "1.5px solid #dee2e6" }}
                            >
                                <i className={`bi ${link.biClass}`} style={{ fontSize: "2rem", color: link.color }} />
                                <span className="fw-semibold small text-dark">{link.label}</span>
                            </Link>
                        </div>
                    ))}
                </div>

                {}
                {!location.pathname.startsWith("/ward/") ? (
                    <div className="card shadow-sm p-4 text-center" style={{ border: "1.5px solid #dee2e6", borderRadius: "12px" }}>
                        <h6 className="mb-1 fw-semibold text-dark">Welcome to Ward Management</h6>
                        <p className="text-muted small mb-0">Select an option above to continue</p>
                    </div>
                ) : (
                    <div className="card shadow-sm" style={{ borderRadius: "12px" }}>
                        <div className="card-body">
                            <Outlet />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
