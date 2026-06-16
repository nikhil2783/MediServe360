import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TopNavbar from "../common/TopNavbar";

export default function FindAllNotification() {

    const [data, setData] = useState([]);
    const token = localStorage.getItem("token");
    const headers = { Authorization: "Bearer " + token };

    async function fetchNotifications() {
        const url = "http://localhost:9002/notification/fetchallnotifications";
        try {
            // ✅ Fixed: added Authorization header
            const res = await axios.get(url, { headers });
            setData(res.data);
        } catch (err) {
            toast.error(err.message);
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    const categoryColor = (category) => {
        switch ((category || "").toUpperCase()) {
            case "ALERT":        return { bg: "#fee2e2", color: "#dc2626" };
            case "REMINDER":     return { bg: "#fef9c3", color: "#ca8a04" };
            case "INFO":         return { bg: "#dbeafe", color: "#2563eb" };
            case "APPOINTMENT":  return { bg: "#e0e7ff", color: "#4338ca" };
            case "CANCELLATION": return { bg: "#fee2e2", color: "#dc2626" };
            case "RESCHEDULE":   return { bg: "#fff7ed", color: "#c2410c" };
            default:             return { bg: "#f1f5f9", color: "#475569" };
        }
    };

    const statusColor = (status) => {
        switch ((status || "").toUpperCase()) {
            case "UNREAD": return { bg: "#fee2e2", color: "#dc2626" };
            case "READ":   return { bg: "#dcfce7", color: "#16a34a" };
            default:       return { bg: "#f1f5f9", color: "#475569" };
        }
    };

    const categoryIcon = (category) => {
        switch ((category || "").toUpperCase()) {
            case "ALERT":        return "🚨";
            case "REMINDER":     return "⏰";
            case "APPOINTMENT":  return "📅";
            case "CANCELLATION": return "❌";
            case "RESCHEDULE":   return "🔄";
            default:             return "ℹ️";
        }
    };

    return (
        <div className="min-vh-100" style={{ backgroundColor: "#f0f2f5" }}>
            <TopNavbar />

            <div className="container py-4" style={{ maxWidth: 900 }}>

                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                            🔔 Notifications
                        </h4>
                        <p className="text-muted small mb-0">
                            {data.length} notification{data.length !== 1 ? "s" : ""} found
                        </p>
                    </div>
                </div>

                {data.length === 0 ? (
                    <div className="card border-0 shadow-sm text-center py-5"
                        style={{ borderRadius: "14px" }}>
                        <div style={{ fontSize: "3rem" }}>🔕</div>
                        <h6 className="fw-semibold mt-3 mb-1" style={{ color: "#334155" }}>
                            No notifications yet
                        </h6>
                        <p className="text-muted small mb-0">You're all caught up!</p>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {data.map((m) => {
                            // ✅ Fixed: notificationId (lowercase) matches fixed NotificationResponseDTO
                            const id     = m.notificationId || m.notificationID;
                            const cat    = categoryColor(m.category);
                            const status = statusColor(m.status);
                            return (
                                <div
                                    key={id}
                                    className="card border-0 shadow-sm"
                                    style={{
                                        borderRadius: "14px",
                                        borderLeft: `4px solid ${cat.color}`,
                                    }}
                                >
                                    <div className="card-body d-flex align-items-start justify-content-between gap-3 p-4">

                                        {}
                                        <div style={{
                                            width: 44, height: 44, borderRadius: "12px",
                                            background: cat.bg, flexShrink: 0,
                                            display: "flex", alignItems: "center",
                                            justifyContent: "center", fontSize: "1.3rem",
                                        }}>
                                            {categoryIcon(m.category)}
                                        </div>

                                        {}
                                        <div style={{ flex: 1 }}>
                                            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                                                <span style={{
                                                    fontSize: "11px", fontWeight: 700,
                                                    padding: "2px 10px", borderRadius: "20px",
                                                    background: cat.bg, color: cat.color,
                                                    letterSpacing: "0.05em",
                                                }}>
                                                    {m.category}
                                                </span>
                                                <span style={{
                                                    fontSize: "11px", fontWeight: 700,
                                                    padding: "2px 10px", borderRadius: "20px",
                                                    background: status.bg, color: status.color,
                                                    letterSpacing: "0.05em",
                                                }}>
                                                    {m.status}
                                                </span>
                                                <span style={{ fontSize: "11px", color: "#94a3b8", marginLeft: "auto" }}>
                                                    ID #{id}
                                                </span>
                                            </div>
                                            <p className="mb-1" style={{ fontSize: "14px", color: "#334155", lineHeight: 1.6 }}>
                                                {m.message}
                                            </p>
                                            {m.createdDate && (
                                                <small className="text-muted">
                                                    🕐 {new Date(m.createdDate).toLocaleString()}
                                                </small>
                                            )}
                                        </div>

                                        {}
                                        <Link
                                            to={`/notification/delete/${id}`}
                                            className="btn btn-sm fw-semibold"
                                            style={{
                                                background: "#fee2e2", color: "#dc2626",
                                                border: "none", borderRadius: "8px",
                                                padding: "6px 14px", flexShrink: 0,
                                                fontSize: "13px",
                                            }}
                                        >
                                            <i className="bi bi-trash me-1"></i>Delete
                                        </Link>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}