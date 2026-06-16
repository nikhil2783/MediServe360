import { Link } from "react-router-dom";
import TopNavbar from "../common/TopNavbar";
import { useEffect, useState } from "react";
import axios from "axios";

const BASE = "http://localhost:9002";

const navLinks = [
    { to: "/patient", label: "Patients", icon: "🧾" },
    { to: "/appointment", label: "Appointments", icon: "📅" },
    { to: "/doctor", label: "Doctors", icon: "👨‍⚕️" },
];

const quickActions = [
    { to: "/patient/add",      label: "Add Patient",       icon: "➕", color: "primary" },
    { to: "/appointment/add",  label: "Book Appointment",  icon: "📅", color: "success" },
    { to: "/doctor/display",   label: "View Doctors",      icon: "👨‍⚕️", color: "dark" },
];

export default function ReceptionistDD() {

    const userName = localStorage.getItem("userName") || "User";
    const token = localStorage.getItem("token");
    const headers = { Authorization: "Bearer " + token };

    const [loading, setLoading] = useState(true);
    const [totalPatients,   setTotalPatients]   = useState(0);
    const [totalDoctors,    setTotalDoctors]     = useState(0);
    const [appointmentsToday,  setAppointmentsToday]  = useState(0);
    const [completedToday,  setCompletedToday]   = useState(0);
    const [recentAppointments, setRecentAppointments] = useState([]);

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // ✅ Fetch all in parallel — real API calls
                const [patientsRes, doctorsRes, appointmentsRes] = await Promise.allSettled([
                    axios.get(`${BASE}/api/patient/fetchAllPatients`, { headers }),
                    axios.get(`${BASE}/api/doctor/getAll`, { headers }),
                    axios.get(`${BASE}/api/appointment/getAll`, { headers }),
                ]);

                // ✅ Total Patients
                if (patientsRes.status === "fulfilled") {
                    setTotalPatients(patientsRes.value.data.length || 0);
                }

                // ✅ Total Doctors
                if (doctorsRes.status === "fulfilled") {
                    setTotalDoctors(doctorsRes.value.data.length || 0);
                }

                // ✅ Appointments Today + Completed Today + Recent Activity
                if (appointmentsRes.status === "fulfilled") {
                    const appointments = appointmentsRes.value.data || [];

                    const todayAppts = appointments.filter(a => a.date === today);
                    setAppointmentsToday(todayAppts.length);
                    setCompletedToday(todayAppts.filter(a => a.status === "COMPLETED").length);

                    // ✅ Recent appointments — last 5 sorted by date desc
                    const recent = [...appointments]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 5);
                    setRecentAppointments(recent);
                }

            } catch (err) {
                console.error("Dashboard load error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const statCards = [
        { label: "Total Patients",      value: totalPatients,     icon: "👥", color: "primary" },
        { label: "Appointments Today",  value: appointmentsToday, icon: "📅", color: "success" },
        { label: "Total Doctors",       value: totalDoctors,      icon: "👨‍⚕️", color: "warning" },
        { label: "Completed Today",     value: completedToday,    icon: "✅", color: "info"    },
    ];

    const getStatusIcon = (status) => {
        switch ((status || "").toUpperCase()) {
            case "COMPLETED":   return "✅";
            case "CANCELLED":   return "❌";
            case "RESCHEDULED": return "🔄";
            case "BOOKED":      return "📅";
            default:            return "📋";
        }
    };

    const getStatusColor = (status) => {
        switch ((status || "").toUpperCase()) {
            case "COMPLETED":   return "#16a34a";
            case "CANCELLED":   return "#dc2626";
            case "RESCHEDULED": return "#d97706";
            case "BOOKED":      return "#2563eb";
            default:            return "#64748b";
        }
    };

    return (
        <div className="min-vh-100 bg-light">
            <TopNavbar />

            <div className="container-fluid px-4 py-4">

                {}
                <div className="rounded-3 p-4 mb-4 text-white position-relative"
                    style={{
                        background: "linear-gradient(135deg, rgba(13,110,253,0.85), rgba(10,88,202,0.85))",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                    }}>
                    <h4 className="mb-1">👋 Welcome back, {userName}!</h4>
                    <p className="mb-0" style={{ opacity: 0.9 }}>
                        Reception Dashboard · MediServe 360
                    </p>
                </div>

                {}
                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary me-2"></div>
                        <span className="text-muted">Loading dashboard...</span>
                    </div>
                ) : (
                    <div className="row g-3 mb-4">
                        {statCards.map((s) => (
                            <div className="col-12 col-sm-6 col-xl-3" key={s.label}>
                                <div className={`card border-0 shadow-sm border-start border-4 border-${s.color}`}>
                                    <div className="card-body d-flex align-items-center gap-3">
                                        <div className={`bg-${s.color} bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center`}
                                            style={{ width: "52px", height: "52px", fontSize: "1.4rem" }}>
                                            {s.icon}
                                        </div>
                                        <div>
                                            <p className="text-muted small mb-1 text-uppercase fw-semibold"
                                                style={{ fontSize: "0.7rem" }}>
                                                {s.label}
                                            </p>
                                            <h5 className="fw-bold mb-0">{s.value}</h5>
                                            <span className="small text-success">● Live</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

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
                                                className="btn btn-outline-dark w-100 py-3 d-flex flex-column align-items-center gap-2 text-center hover-card"
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
                                <h6 className="fw-bold mb-0">📋 Recent Appointments</h6>
                            </div>
                            <div className="card-body p-0">
                                {recentAppointments.length === 0 ? (
                                    <p className="text-muted small text-center py-4">
                                        No appointments found
                                    </p>
                                ) : (
                                    <ul className="list-group list-group-flush">
                                        {recentAppointments.map((a) => (
                                            <li key={a.id}
                                                className="list-group-item border-0 py-3 px-3">
                                                <div className="d-flex align-items-center gap-2">
                                                    <span style={{ fontSize: "1.2rem" }}>
                                                        {getStatusIcon(a.status)}
                                                    </span>
                                                    <div style={{ flex: 1 }}>
                                                        <div className="small fw-semibold" style={{ color: "#1e293b" }}>
                                                            {a.patient?.patientName || `Patient #${a.patientId}`}
                                                        </div>
                                                        <div className="small text-muted">
                                                            {a.date} · {a.time?.slice(0, 5)}
                                                        </div>
                                                    </div>
                                                    <span className="badge rounded-pill"
                                                        style={{
                                                            background: getStatusColor(a.status) + "22",
                                                            color: getStatusColor(a.status),
                                                            fontSize: "10px",
                                                            fontWeight: 700,
                                                        }}>
                                                        {a.status}
                                                    </span>
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
                <div className="card border-0 shadow-sm mt-4">
                    <div className="card-header bg-white border-bottom">
                        <h6 className="fw-bold mb-0">⚡ Quick Actions</h6>
                    </div>
                    <div className="card-body d-flex flex-wrap gap-2">
                        {quickActions.map((btn) => (
                            <Link key={btn.to} to={btn.to} className={`btn btn-${btn.color}`}>
                                {btn.icon} {btn.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .hover-card { transition: all 0.25s ease; }
                .hover-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
            `}</style>
        </div>
    );
}