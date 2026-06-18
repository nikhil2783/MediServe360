import { Link } from "react-router-dom";
import TopNavbar from "../common/TopNavbar";
import { useEffect, useState } from "react";
import axios from "axios";

const BASE = "http://localhost:9002";

const navLinks = [
    { to: "/insuranceClaim", label: "Insurance Claim", icon: "🛡️" },
    { to: "/invoice",        label: "Invoice",         icon: "🧾" },
];

export default function FinanceDD() {

    const headers = { Authorization: "Bearer " + localStorage.getItem("token") };
    const userName = localStorage.getItem("userName") || "Finance Officer";

    const [loading,        setLoading]        = useState(true);
    const [totalRevenue,   setTotalRevenue]    = useState(0);
    const [pendingClaims,  setPendingClaims]   = useState(0);
    const [totalInvoices,  setTotalInvoices]   = useState(0);
    const [unpaidAmount,   setUnpaidAmount]    = useState(0);
    const [approvedClaims, setApprovedClaims]  = useState(0);
    const [rejectedClaims, setRejectedClaims]  = useState(0);
    const [recentInvoices, setRecentInvoices]  = useState([]);
    const [recentClaims,   setRecentClaims]    = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [invoicesRes, claimsRes] = await Promise.allSettled([
                    axios.get(`${BASE}/api/invoice/fetchAllInvoices`, { headers }),
                    axios.get(`${BASE}/api/insurance/fetchAllInsuranceClaims`, { headers }),
                ]);

                if (invoicesRes.status === "fulfilled") {
                    const invoices = invoicesRes.value.data || [];
                    setTotalInvoices(invoices.length);

                    const revenue = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
                    setTotalRevenue(revenue);

                    const unpaid = invoices
                        .filter(inv => (inv.paymentStatus || "").toUpperCase() !== "PAID")
                        .reduce((sum, inv) => sum + (inv.amount || 0), 0);
                    setUnpaidAmount(unpaid);

                    setRecentInvoices(invoices.slice(-5).reverse());
                }

                if (claimsRes.status === "fulfilled") {
                    const claims = claimsRes.value.data || [];

                    setPendingClaims(claims.filter(c => (c.status || "").toUpperCase() === "SUBMITTED").length);
                    setApprovedClaims(claims.filter(c => (c.status || "").toUpperCase() === "APPROVED").length);
                    setRejectedClaims(claims.filter(c => (c.status || "").toUpperCase() === "REJECTED").length);

                    setRecentClaims(claims.slice(-5).reverse());
                }

            } catch (err) {
                console.error("Finance dashboard error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const formatCurrency = (val) => {
        if (val >= 10_00_000) return `₹${(val / 10_00_000).toFixed(1)}L`;
        if (val >= 1_000)     return `₹${(val / 1_000).toFixed(1)}K`;
        return `₹${val.toFixed(0)}`;
    };

    const stats = [
        { label: "Total Revenue",   value: formatCurrency(totalRevenue), icon: "💰", color: "primary" },
        { label: "Pending Claims",  value: pendingClaims,                icon: "🛡️", color: "warning" },
        { label: "Invoices Raised", value: totalInvoices,                icon: "🧾", color: "success" },
        { label: "Outstanding",     value: formatCurrency(unpaidAmount), icon: "📊", color: "info"    },
    ];

    const getClaimIcon = (status) => {
        switch ((status || "").toUpperCase()) {
            case "APPROVED":  return "✅";
            case "REJECTED":  return "❌";
            case "SUBMITTED": return "🕐";
            default:          return "📋";
        }
    };

    return (
        <div className="min-vh-100 bg-light">
            <TopNavbar />

            <div className="container-fluid px-4 py-4">

                {}
                <div
  className="mb-4 p-4 rounded-4 text-white d-flex align-items-center justify-content-between"
  style={{
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f3460 100%)",
    minHeight: 100,
  }}
>
  <div>
    <h4 className="fw-bold mb-1">
      Welcome back, {userName} 👋
    </h4>

    <p className="mb-0 small fw-semibold" style={{ color: "#93c5fd" }}>
      Finance Officer
    </p>

    <p className="mb-0 small" style={{ color: "#cbd5f5" }}>
      Manage billing, payments, and financial records with accuracy and efficiency.
    </p>
  </div>

  <div style={{ fontSize: "3rem", opacity: 0.3 }}>🏥</div>
</div>


                {}
                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary me-2"></div>
                        <span className="text-muted">Loading dashboard...</span>
                    </div>
                ) : (
                    <div className="row g-3 mb-4">
                        {stats.map((s) => (
                            <div className="col-12 col-sm-6 col-xl-3" key={s.label}>
                                <div className={`card border-0 shadow-sm h-100 border-start border-4 border-${s.color}`}>
                                    <div className="card-body d-flex align-items-center gap-3">
                                        <div
                                            className={`bg-${s.color} bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center`}
                                            style={{ width: "52px", height: "52px", fontSize: "1.5rem" }}
                                        >
                                            {s.icon}
                                        </div>
                                        <div>
                                            <p className="text-muted small mb-1 text-uppercase fw-semibold"
                                                style={{ fontSize: "0.7rem" }}>
                                                {s.label}
                                            </p>
                                            <h5 className="fw-bold mb-1">{s.value}</h5>
                                            <span className="small text-success">● Live</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {}
                <div className="row g-3 mb-4">
                    {[
                        { label: "Approved Claims", value: approvedClaims, color: "success", icon: "✅" },
                        { label: "Pending Claims",  value: pendingClaims,  color: "warning", icon: "🕐" },
                        { label: "Rejected Claims", value: rejectedClaims, color: "danger",  icon: "❌" },
                    ].map((s) => (
                        <div className="col-md-4" key={s.label}>
                            <div className="card border-0 shadow-sm text-center p-3">
                                <div style={{ fontSize: "1.5rem" }}>{s.icon}</div>
                                <h4 className={`fw-bold text-${s.color} mb-0`}>{s.value}</h4>
                                <small className="text-muted">{s.label}</small>
                            </div>
                        </div>
                    ))}
                </div>

                {}
                <div className="row g-3">

                    {}
                    <div className="col-12 col-lg-8">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-bottom py-3">
                                <h6 className="fw-bold mb-0">⬡ Modules</h6>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    {navLinks.map((link) => (
                                        <div className="col-6 col-sm-4 col-md-3" key={link.to}>
                                            <Link
                                                to={link.to}
                                                className="btn btn-outline-dark w-100 py-3 d-flex flex-column align-items-center gap-2"
                                                style={{ borderRadius: "10px" }}
                                            >
                                                <span style={{ fontSize: "1.6rem" }}>{link.icon}</span>
                                                <span className="small fw-semibold">{link.label}</span>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="col-12 col-lg-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-bottom py-3">
                                <h6 className="fw-bold mb-0">🔔 Recent Claims</h6>
                            </div>
                            <div className="card-body p-0">
                                {recentClaims.length === 0 ? (
                                    <p className="text-muted small text-center py-4">No recent claims</p>
                                ) : (
                                    <ul className="list-group list-group-flush">
                                        {recentClaims.map((c) => (
                                            <li key={c.insuranceClaimId}
                                                className="list-group-item border-0 py-3 px-3 d-flex gap-2">
                                                <span>{getClaimIcon(c.status)}</span>
                                                <div>
                                                    <div className="small fw-semibold">
                                                        Claim #{c.insuranceClaimId} — ₹{c.amount?.toLocaleString()}
                                                    </div>
                                                    <small className="text-muted">
                                                        Policy: {c.policyNumber} · {c.status}
                                                    </small>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                {}
                {recentInvoices.length > 0 && (
                    <div className="card border-0 shadow-sm mt-4">
                        <div className="card-header bg-white border-bottom py-3">
                            <h6 className="fw-bold mb-0">🧾 Recent Invoices</h6>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
                                    <thead className="table-light">
                                        <tr>
                                            <th>Invoice ID</th>
                                            <th>Patient</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentInvoices.map((inv) => (
                                            <tr key={inv.invoiceId}>
                                                <td>#{inv.invoiceId}</td>
                                                <td>{inv.patient?.patientName || `Patient #${inv.patient?.patientId}`}</td>
                                                <td>₹{inv.amount?.toLocaleString()}</td>
                                                <td>
                                                    {}
                                                    <span className={`badge ${
                                                        (inv.paymentStatus || "").toUpperCase() === "PAID"
                                                            ? "bg-success"
                                                            : "bg-warning text-dark"
                                                    }`}>
                                                        {inv.paymentStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}