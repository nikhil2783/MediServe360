// src/components/Bed/BedHome.jsx
import { Link, Outlet, useLocation } from "react-router-dom";
import TopNavbar from "../common/TopNavbar";

const BedIcon = ({ size = 28, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9v11"/>
        <path d="M22 9v11"/>
        <path d="M2 19h20"/>
        <path d="M2 14h20"/>
        <path d="M2 9h2"/>
        <path d="M20 9h2"/>
        <rect x="5" y="10" width="6" height="4" rx="1"/>
    </svg>
);

const navLinks = [
    { to: "add",          label: "Add Bed",    biClass: "bi-plus-circle-fill",      color: "#6f42c1", useBed: false },
    { to: "find",         label: "Find Bed",   biClass: "bi-search",                color: "#0d6efd", useBed: false },
    { to: "findAll",      label: "All Beds",   biClass: "",                          color: "#0dcaf0", useBed: true  },
    { to: "assignBed",    label: "Assign Bed", biClass: "bi-person-fill-add",        color: "#198754", useBed: false },
    { to: "dischargeBed", label: "Discharge",  biClass: "bi-box-arrow-right",        color: "#dc3545", useBed: false },
    { to: "pages",        label: "Pages",      biClass: "bi-file-earmark-text-fill", color: "#6c757d", useBed: false },
];

export default function BedHome() {
    const location = useLocation();

    return (
        <div className="min-vh-100 bg-light">
            <TopNavbar />

            <div className="container-fluid px-4 py-4">

                {}
                <div className="d-flex align-items-start justify-content-between mb-4">
                    <div>
                        <Link to="/bed" className="text-decoration-none">
                            <h4 className="fw-bold text-dark mb-1">Bed Management</h4>
                        </Link>
                        <p className="text-muted small mb-0">Manage beds · Assign patients · Discharge</p>
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
                                {link.useBed
                                    ? <BedIcon size={32} color="#0dcaf0" />
                                    : <i className={`bi ${link.biClass}`} style={{ fontSize: "2rem", color: link.color }} />
                                }
                                <span className="fw-semibold small text-dark">{link.label}</span>
                            </Link>
                        </div>
                    ))}
                </div>

                {}
                {!location.pathname.startsWith("/bed/") ? (
                    <div className="card shadow-sm p-4 text-center" style={{ border: "1.5px solid #dee2e6", borderRadius: "12px" }}>
                        <h6 className="mb-1 fw-semibold text-dark">Welcome to Bed Management</h6>
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
