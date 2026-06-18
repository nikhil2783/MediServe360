import { useEffect, useState } from "react";
import axios from "axios";
import TopNavbar from "../common/TopNavbar";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "./DoctorDD.css";

const BASE = "http://localhost:9002";

export default function DoctorDD() {
    const doctorEmail = localStorage.getItem("email");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const headers = { Authorization: "Bearer " + token };

    const [doctorId, setDoctorId] = useState(null);
    const [doctorName, setDoctorName] = useState("");
    const [doctorDept, setDoctorDept] = useState("");
    const [doctorSchedule, setDoctorSchedule] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [vitals, setVitals] = useState({});
    const [activeModal, setActiveModal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingHistory, setEditingHistory] = useState(false);
    const [medicalHistory, setMedicalHistory] = useState("");
    const [savingHistory, setSavingHistory] = useState(false);

    useEffect(() => {
        if (!doctorEmail) { setLoading(false); return; }

        axios.get(`${BASE}/api/doctor/getbyemail?email=${encodeURIComponent(doctorEmail)}`, { headers })
            .then((res) => {
                setDoctorId(res.data.doctor.id);
                setDoctorName(res.data.doctor.name || "");
                setDoctorDept(res.data.doctor.department || "");
                setDoctorSchedule(res.data.doctor.availabilitySchedule || "");

                if (!res.data.doctor.department || !res.data.doctor.availabilitySchedule) {
                    navigate("/complete-profile");
                }
            })
            .catch(() => {
                setError("Failed to fetch doctor details.");
                setLoading(false);
            });
    }, [doctorEmail]);

    useEffect(() => {
        if (!doctorId) return;

        axios.get(`${BASE}/api/appointment/doctor/${doctorId}`, { headers })
            .then((res) => {
                setAppointments(res.data || []);
            })
            .catch(() => setError("Failed to fetch appointments."))
            .finally(() => setLoading(false));
    }, [doctorId]);

    const fetchVitals = (patientId) => {
        axios.get(`${BASE}/api/vitals/patient/${patientId}`, { headers })
            .then((res) => {
                setVitals(prev => ({ ...prev, [patientId]: res.data }));
            })
            .catch(() => {
                setVitals(prev => ({ ...prev, [patientId]: [] }));
            });
    };

    const handleVitalsClick = (patientId) => {
        fetchVitals(patientId);
        setActiveModal({ type: "vitals", patientId });
    };

    const handleReviewClick = (appointment) => {
        setEditingHistory(false);
        setMedicalHistory("");
        setActiveModal({ type: "review", appointment });
    };

    const saveMedicalHistory = (patient) => {
        setSavingHistory(true);
        axios.put(`${BASE}/api/patient/updatePatient`, {
            patient: {
                patientId: patient.patientId,
                patientName: patient.patientName,
                patientDOB: patient.patientDOB,
                patientGender: patient.patientGender,
                patientPhoneNumber: patient.patientPhoneNumber,
                patientMedicalHistory: medicalHistory,
                patientStatus: patient.patientStatus
            }
        }, { headers })
        .then(() => {
            setAppointments(prev => prev.map(a =>
                a.patient?.patientId === patient.patientId
                    ? { ...a, patient: { ...a.patient, patientMedicalHistory: medicalHistory } }
                    : a
            ));
            setActiveModal(prev => ({
                ...prev,
                appointment: {
                    ...prev.appointment,
                    patient: {
                        ...prev.appointment.patient,
                        patientMedicalHistory: medicalHistory
                    }
                }
            }));
            setEditingHistory(false);
            setSavingHistory(false);
        })
        .catch((err) => {
            toast.error(err.response?.data?.message || "Failed to update medical history.");
            setSavingHistory(false);
        });
    };

    const updateStatus = (appointment, newStatus) => {
        const updatedAppointment = {
            appointment: {
                id: appointment.id,
                date: appointment.date,
                time: appointment.time,
                status: newStatus,
                durationMinutes: appointment.durationMinutes,
                patientId: appointment.patient?.patientId || appointment.patientId,
                doctorId: appointment.doctor?.id || appointment.doctorId,
                reason: newStatus === "CANCELLED" ? "Cancelled by doctor" : null
            }
        };
        axios.put(`${BASE}/api/appointment/update`, updatedAppointment, { headers })
            .then(() => {
                setAppointments(prev =>
                    prev.map(a => a.id === appointment.id ? { ...a, status: newStatus } : a)
                );
                setActiveModal(null);
            })
            .catch((err) => {
                const msg = err.response?.data?.message || "Failed to update status.";
                toast.error(msg);
            });
    };

    const closeModal = () => {
        setActiveModal(null);
        setEditingHistory(false);
        setMedicalHistory("");
    };

    const getStatusBadge = (status) => {
        const map = {
            BOOKED:      { bg: "#dbeafe", color: "#1d4ed8" },
            RESCHEDULED: { bg: "#fef9c3", color: "#b45309" },
            COMPLETED:   { bg: "#dcfce7", color: "#15803d" },
            CANCELLED:   { bg: "#fee2e2", color: "#b91c1c" },
        };
        const s = map[status] || { bg: "#f1f5f9", color: "#475569" };
        return (
            <span className="status-badge" style={{ background: s.bg, color: s.color }}>
                {status}
            </span>
        );
    };

    const statCards = [
        { label: "Total Appointments",     value: appointments.length,                                        color: "primary", icon: "📋" },
        { label: "Booked Appointments",    value: appointments.filter(a => a.status === "BOOKED").length,    color: "info",    icon: "📅" },
        { label: "Completed Appointments", value: appointments.filter(a => a.status === "COMPLETED").length, color: "success", icon: "✅" },
        { label: "Cancelled Appointments", value: appointments.filter(a => a.status === "CANCELLED").length, color: "danger",  icon: "❌" },
    ];

    if (loading) return (
        <>
            <TopNavbar />
            <div className="loading-screen">
                <div className="text-center">
                    <div className="spinner-border spinner-blue"></div>
                    <p className="mt-3 loading-text">Loading dashboard...</p>
                </div>
            </div>
        </>
    );

    return (
        <div className="doctor-dd-wrapper">
            <TopNavbar />

            <div className="container-fluid px-4 py-4">

                <div className="welcome-banner mb-4">
                    <div>
                        <h4 className="fw-bold mb-1">Welcome back, Dr. {doctorName} 👋</h4>
                        <p className="mb-0 small banner-role">Doctor</p>
                        <p className="mb-0 small banner-sub">
                            {doctorDept && <span className="me-2">🏥 {doctorDept}</span>}
                            {doctorSchedule && <span>🕐 {doctorSchedule}</span>}
                        </p>
                        <p className="mb-0 small banner-email">{doctorEmail}</p>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <div className="banner-icon">🩺</div>
                        <button
                            onClick={() => navigate("/editdoctor")}
                            className="btn btn-sm edit-profile-btn"
                        >
                            ✏️ Edit Profile
                        </button>
                    </div>
                </div>

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
                                        <div className={`bg-${s.color} bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center stat-icon-box`}>
                                            {s.icon}
                                        </div>
                                        <div>
                                            <p className="text-muted small mb-1 text-uppercase fw-semibold stat-label">
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

                {error && (
                    <div className="alert alert-danger py-2 small mb-3">⚠️ {error}</div>
                )}

                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-bottom py-3">
                        <h6 className="fw-bold mb-0">🧾 My Patients</h6>
                    </div>
                    <div className="card-body p-4">
                        {appointments.length === 0 ? (
                            <p className="text-center text-muted">No appointments found.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table align-middle patients-table">
                                    <thead>
                                        <tr className="table-header-row">
                                            {["#", "Patient Name", "Gender", "Date", "Time", "Duration", "Status", "Actions"].map(h => (
                                                <th key={h} className="small fw-semibold py-2 px-3 table-th">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((appt, idx) => (
                                            <tr key={appt.id} className="table-row">
                                                <td className="px-3 py-3 small text-muted">{idx + 1}</td>
                                                <td className="px-3 py-3 fw-semibold table-name">
                                                    {appt.patient?.patientName || "-"}
                                                </td>
                                                <td className="px-3 py-3 small text-muted">
                                                    {appt.patient?.patientGender || "-"}
                                                </td>
                                                <td className="px-3 py-3 small text-muted">{appt.date}</td>
                                                <td className="px-3 py-3 small text-muted">{appt.time}</td>
                                                <td className="px-3 py-3 small text-muted">{appt.durationMinutes} min</td>
                                                <td className="px-3 py-3">{getStatusBadge(appt.status)}</td>
                                                <td className="px-3 py-3">
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm action-btn-vitals"
                                                            onClick={() => handleVitalsClick(appt.patient?.patientId)}
                                                        >
                                                            🩺 Vitals
                                                        </button>
                                                        <button
                                                            className="btn btn-sm action-btn-review"
                                                            onClick={() => handleReviewClick(appt)}
                                                        >
                                                            📋 Review
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {activeModal?.type === "vitals" && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold mb-0 modal-title-text">🩺 Patient Vitals</h6>
                                <button onClick={closeModal} className="btn btn-sm modal-close-btn">✕ Close</button>
                            </div>
                            {!vitals[activeModal.patientId] ? (
                                <div className="text-center py-3">
                                    <div className="spinner-border text-primary"></div>
                                </div>
                            ) : vitals[activeModal.patientId].length === 0 ? (
                                <p className="text-center small text-muted">No vitals recorded for this patient.</p>
                            ) : (
                                vitals[activeModal.patientId].map((v, i) => (
                                    <div key={v.vitalId} className="vitals-record mb-2">
                                        <div className="small fw-semibold mb-2 vitals-record-title">
                                            Record #{i + 1} — {new Date(v.recordedAt).toLocaleString()}
                                        </div>
                                        <div className="row g-2">
                                            {[
                                                { label: "Blood Pressure", value: v.bloodPressure, unit: "mmHg" },
                                                { label: "Temperature",    value: v.temperature,   unit: "°C"   },
                                                { label: "Pulse Rate",     value: v.pulseRate,     unit: "bpm"  },
                                                { label: "SpO2",           value: v.spo2,          unit: "%"    },
                                            ].map(item => (
                                                <div className="col-6" key={item.label}>
                                                    <div className="vital-item text-center">
                                                        <div className="small vital-item-label">{item.label}</div>
                                                        <div className="fw-bold vital-item-value">
                                                            {item.value ?? "—"}{" "}
                                                            <span className="vital-unit">
                                                                {item.value ? item.unit : ""}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeModal?.type === "review" && (
                <div className="modal-overlay">
                    <div className="modal-card modal-card-review">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold mb-0 modal-title-text">📋 Review Appointment</h6>
                                <button onClick={closeModal} className="btn btn-sm modal-close-btn">✕ Close</button>
                            </div>

                            {activeModal.appointment.patient && (
                                <div className="review-patient-box mb-3">
                                    <div className="fw-semibold review-patient-name">
                                        {activeModal.appointment.patient.patientName}
                                    </div>
                                    <div className="small review-patient-sub">
                                        {activeModal.appointment.patient.patientGender} •{" "}
                                        DOB: {activeModal.appointment.patient.patientDOB}
                                    </div>
                                    <div className="small mt-1 review-patient-sub">
                                        📞 {activeModal.appointment.patient.patientPhoneNumber}
                                    </div>

                                    <div className="mt-3">
                                        <div className="d-flex align-items-center justify-content-between mb-1">
                                            <span className="small fw-semibold review-patient-name">📄 Medical History</span>
                                            {!editingHistory && (
                                                <button
                                                    className="btn btn-sm edit-history-btn"
                                                    onClick={() => {
                                                        setMedicalHistory(activeModal.appointment.patient.patientMedicalHistory || "");
                                                        setEditingHistory(true);
                                                    }}
                                                >
                                                    ✏️ Edit
                                                </button>
                                            )}
                                        </div>

                                        {editingHistory ? (
                                            <>
                                                <textarea
                                                    className="form-control form-control-sm"
                                                    rows={3}
                                                    value={medicalHistory}
                                                    onChange={(e) => setMedicalHistory(e.target.value)}
                                                    placeholder="Enter medical history..."
                                                    style={{ resize: "vertical", fontSize: "13px" }}
                                                />
                                                <div className="d-flex gap-2 mt-2">
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => saveMedicalHistory(activeModal.appointment.patient)}
                                                        disabled={savingHistory}
                                                    >
                                                        {savingHistory
                                                            ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</>
                                                            : "💾 Save"}
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => setEditingHistory(false)}
                                                        disabled={savingHistory}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="medical-history-display">
                                                {activeModal.appointment.patient.patientMedicalHistory || "No medical history recorded"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="d-flex align-items-center gap-2 mb-3">
                                <span className="small fw-semibold review-patient-name">Current Status:</span>
                                {getStatusBadge(activeModal.appointment.status)}
                            </div>

                            <div className="mb-3 small review-patient-sub">
                                📅 {activeModal.appointment.date} · ⏰ {activeModal.appointment.time} · ⌛ {activeModal.appointment.durationMinutes} min
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    className="btn w-100 fw-semibold text-white btn-complete"
                                    onClick={() => updateStatus(activeModal.appointment, "COMPLETED")}
                                >
                                    ✅ Completed
                                </button>
                                <button
                                    className="btn w-100 fw-semibold text-white btn-cancel"
                                    onClick={() => updateStatus(activeModal.appointment, "CANCELLED")}
                                >
                                    ❌ Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}