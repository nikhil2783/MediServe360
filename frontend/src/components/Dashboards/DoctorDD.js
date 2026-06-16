import { useEffect, useState } from "react";
import axios from "axios";
import TopNavbar from "../common/TopNavbar";
import { useNavigate } from "react-router";

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

    // ✅ Medical history editing state
    const [editingHistory, setEditingHistory] = useState(false);
    const [medicalHistory, setMedicalHistory] = useState("");
    const [savingHistory, setSavingHistory] = useState(false);

    // ✅ Fetch doctor by email on mount
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

    // ✅ Fetch appointments once doctorId is available
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

    // ✅ Save medical history — calls Patient Service via Gateway
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
            // ✅ Update local state so UI reflects change immediately
            setAppointments(prev => prev.map(a =>
                a.patient?.patientId === patient.patientId
                    ? { ...a, patient: { ...a.patient, patientMedicalHistory: medicalHistory } }
                    : a
            ));
            // ✅ Update active modal patient too
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
            alert(err.response?.data?.message || "Failed to update medical history.");
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
                alert(msg);
            });
    };

    const closeModal = () => {
        setActiveModal(null);
        setEditingHistory(false); // ✅ reset on close
        setMedicalHistory("");
    };

    const getStatusBadge = (status) => {
        const styles = {
            BOOKED:      { background: "#e3f2fb", color: "#1a73a7" },
            RESCHEDULED: { background: "#fff8e1", color: "#f57c00" },
            COMPLETED:   { background: "#e8f5e9", color: "#2e7d32" },
            CANCELLED:   { background: "#fdecea", color: "#c62828" },
        };
        const s = styles[status] || { background: "#f0f0f0", color: "#555" };
        return (
            <span style={{
                ...s, padding: "3px 10px", borderRadius: "20px",
                fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px"
            }}>
                {status}
            </span>
        );
    };

    if (loading) return (
        <>
            <TopNavbar />
            <div className="min-vh-100 d-flex align-items-center justify-content-center"
                style={{ background: "linear-gradient(135deg, #e8f4f8 0%, #d6eaf8 50%, #eaf4fb 100%)" }}>
                <div className="text-center">
                    <div className="spinner-border" style={{ color: "#1a73a7" }}></div>
                    <p className="mt-3" style={{ color: "#1a3c5e" }}>Loading dashboard...</p>
                </div>
            </div>
        </>
    );

    return (
        <div className="min-vh-100"
            style={{ background: "linear-gradient(135deg, #e8f4f8 0%, #d6eaf8 50%, #eaf4fb 100%)" }}>

            <TopNavbar />

            <div className="py-4 px-3">

                {}
                <div className="container mb-4">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-3 flex-wrap">
                                <div className="d-inline-flex align-items-center justify-content-center rounded-circle"
                                    style={{ width: 56, height: 56, background: "#1a73a7", flexShrink: 0 }}>
                                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                                        <rect x="12" y="4" width="8" height="24" rx="2" fill="white" />
                                        <rect x="4" y="12" width="24" height="8" rx="2" fill="white" />
                                    </svg>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fw-bold mb-0" style={{ color: "#1a3c5e" }}>
                                        Welcome, Dr. {doctorName}
                                    </h5>
                                    <p className="small mb-0" style={{ color: "#5a8fa8" }}>
                                        {doctorDept && <span className="me-2">🏥 {doctorDept}</span>}
                                        {doctorSchedule && <span>🕐 {doctorSchedule}</span>}
                                    </p>
                                    <p className="small mb-0" style={{ color: "#5a8fa8" }}>{doctorEmail}</p>
                                </div>
                                <button
                                    onClick={() => navigate("/editdoctor")}
                                    className="btn btn-sm fw-semibold"
                                    style={{ background: "#1a73a7", color: "#fff", borderRadius: "8px", border: "none", padding: "8px 18px" }}
                                >
                                    ✏️ Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="container mb-4">
                    <div className="row g-3">
                        {[
                            { label: "Total",     value: appointments.length,                                        color: "#1a73a7", bg: "#e3f2fb" },
                            { label: "Booked",    value: appointments.filter(a => a.status === "BOOKED").length,    color: "#1a73a7", bg: "#e3f2fb" },
                            { label: "Completed", value: appointments.filter(a => a.status === "COMPLETED").length, color: "#2e7d32", bg: "#e8f5e9" },
                            { label: "Cancelled", value: appointments.filter(a => a.status === "CANCELLED").length, color: "#c62828", bg: "#fdecea" },
                        ].map(stat => (
                            <div className="col-6 col-md-3" key={stat.label}>
                                <div className="card border-0 shadow-sm text-center p-3"
                                    style={{ borderRadius: "14px", background: stat.bg }}>
                                    <div className="fw-bold" style={{ fontSize: "1.8rem", color: stat.color }}>
                                        {stat.value}
                                    </div>
                                    <div className="small" style={{ color: "#5a8fa8" }}>{stat.label} Appointments</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {}
                {error && (
                    <div className="container mb-3">
                        <div className="alert alert-danger py-2 small">⚠️ {error}</div>
                    </div>
                )}

                {}
                <div className="container">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                        <div className="card-body p-4">

                            <div className="d-flex align-items-center gap-2 mb-4">
                                <hr className="flex-grow-1 m-0" style={{ borderColor: "#c8dfe9" }} />
                                <span className="small px-2 py-1 rounded-pill fw-semibold"
                                    style={{ background: "#e3f2fb", color: "#1a73a7", fontSize: "0.7rem", letterSpacing: "0.06em" }}>
                                    MY PATIENTS
                                </span>
                                <hr className="flex-grow-1 m-0" style={{ borderColor: "#c8dfe9" }} />
                            </div>

                            {appointments.length === 0 ? (
                                <p className="text-center" style={{ color: "#5a8fa8" }}>No appointments found.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table align-middle" style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
                                        <thead>
                                            <tr style={{ background: "#e3f2fb" }}>
                                                {["#", "Patient Name", "Gender", "Date", "Time", "Duration", "Status", "Actions"].map(h => (
                                                    <th key={h} className="small fw-semibold py-2 px-3"
                                                        style={{ color: "#1a3c5e", border: "none", whiteSpace: "nowrap" }}>
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.map((appt, idx) => (
                                                <tr key={appt.id} style={{ background: "#fff" }}>
                                                    <td className="px-3 py-3 small" style={{ color: "#5a8fa8" }}>{idx + 1}</td>
                                                    <td className="px-3 py-3 fw-semibold" style={{ color: "#1a3c5e" }}>
                                                        {appt.patient?.patientName || "-"}
                                                    </td>
                                                    <td className="px-3 py-3 small" style={{ color: "#5a8fa8" }}>
                                                        {appt.patient?.patientGender || "-"}
                                                    </td>
                                                    
                                                    <td className="px-3 py-3 small" style={{ color: "#5a8fa8" }}>{appt.date}</td>
                                                    <td className="px-3 py-3 small" style={{ color: "#5a8fa8" }}>{appt.time}</td>
                                                    <td className="px-3 py-3 small" style={{ color: "#5a8fa8" }}>{appt.durationMinutes} min</td>
                                                    <td className="px-3 py-3">{getStatusBadge(appt.status)}</td>
                                                    <td className="px-3 py-3">
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-sm fw-semibold"
                                                                onClick={() => handleVitalsClick(appt.patient?.patientId)}
                                                                style={{ background: "#e3f2fb", color: "#1a73a7", borderRadius: "8px", border: "none", fontSize: "12px" }}
                                                            >
                                                                🩺 Vitals
                                                            </button>
                                                            <button
                                                                className="btn btn-sm fw-semibold"
                                                                onClick={() => handleReviewClick(appt)}
                                                                style={{ background: "#e8f5e9", color: "#2e7d32", borderRadius: "8px", border: "none", fontSize: "12px" }}
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
            </div>

            {}
            {activeModal?.type === "vitals" && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="card border-0 shadow-lg" style={{ width: "100%", maxWidth: 500, borderRadius: "16px", maxHeight: "80vh", overflowY: "auto" }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold mb-0" style={{ color: "#1a3c5e" }}>🩺 Patient Vitals</h6>
                                <button onClick={closeModal} className="btn btn-sm"
                                    style={{ background: "#fdecea", color: "#c62828", borderRadius: "8px", border: "none" }}>
                                    ✕ Close
                                </button>
                            </div>
                            {!vitals[activeModal.patientId] ? (
                                <div className="text-center py-3">
                                    <div className="spinner-border" style={{ color: "#1a73a7" }}></div>
                                </div>
                            ) : vitals[activeModal.patientId].length === 0 ? (
                                <p className="text-center small" style={{ color: "#5a8fa8" }}>No vitals recorded for this patient.</p>
                            ) : (
                                vitals[activeModal.patientId].map((v, i) => (
                                    <div key={v.vitalId} className="p-3 mb-2 rounded"
                                        style={{ background: "#f7fafc", border: "1px solid #e3f2fb" }}>
                                        <div className="small fw-semibold mb-2" style={{ color: "#1a73a7" }}>
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
                                                    <div className="p-2 rounded text-center" style={{ background: "#e3f2fb" }}>
                                                        <div className="small" style={{ color: "#5a8fa8", fontSize: "11px" }}>{item.label}</div>
                                                        <div className="fw-bold" style={{ color: "#1a3c5e" }}>
                                                            {item.value ?? "—"}{" "}
                                                            <span style={{ fontSize: "11px", fontWeight: 400 }}>
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

            {}
            {activeModal?.type === "review" && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="card border-0 shadow-lg" style={{ width: "100%", maxWidth: 480, borderRadius: "16px", maxHeight: "90vh", overflowY: "auto" }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold mb-0" style={{ color: "#1a3c5e" }}>📋 Review Appointment</h6>
                                <button onClick={closeModal} className="btn btn-sm"
                                    style={{ background: "#fdecea", color: "#c62828", borderRadius: "8px", border: "none" }}>
                                    ✕ Close
                                </button>
                            </div>

                            {}
                            {activeModal.appointment.patient && (
                                <div className="p-3 rounded mb-3"
                                    style={{ background: "#f7fafc", border: "1px solid #e3f2fb" }}>

                                    {}
                                    <div className="fw-semibold mb-1" style={{ color: "#1a3c5e" }}>
                                        {activeModal.appointment.patient.patientName}
                                    </div>
                                    <div className="small" style={{ color: "#5a8fa8" }}>
                                        {activeModal.appointment.patient.patientGender} •{" "}
                                        DOB: {activeModal.appointment.patient.patientDOB}
                                    </div>
                                    <div className="small mt-1" style={{ color: "#5a8fa8" }}>
                                        📞 {activeModal.appointment.patient.patientPhoneNumber}
                                    </div>

                                    {}
                                    <div className="mt-3">
                                        <div className="d-flex align-items-center justify-content-between mb-1">
                                            <span className="small fw-semibold" style={{ color: "#1a3c5e" }}>
                                                📄 Medical History
                                            </span>
                                            {!editingHistory && (
                                                <button
                                                    className="btn btn-sm"
                                                    onClick={() => {
                                                        setMedicalHistory(
                                                            activeModal.appointment.patient.patientMedicalHistory || ""
                                                        );
                                                        setEditingHistory(true);
                                                    }}
                                                    style={{
                                                        background: "#e3f2fb", color: "#1a73a7",
                                                        border: "none", borderRadius: "6px",
                                                        fontSize: "11px", padding: "2px 10px"
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
                                            <div className="small p-2 rounded"
                                                style={{ background: "#e3f2fb", color: "#1a3c5e" }}>
                                                {activeModal.appointment.patient.patientMedicalHistory
                                                    || "No medical history recorded"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {}
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <span className="small fw-semibold" style={{ color: "#1a3c5e" }}>Current Status:</span>
                                {getStatusBadge(activeModal.appointment.status)}
                            </div>

                            <div className="mb-3 small" style={{ color: "#5a8fa8" }}>
                                📅 {activeModal.appointment.date} · ⏰ {activeModal.appointment.time} · ⌛ {activeModal.appointment.durationMinutes} min
                            </div>

                            {}
                            <div className="d-flex gap-2">
                                <button
                                    className="btn w-100 fw-semibold text-white"
                                    onClick={() => updateStatus(activeModal.appointment, "COMPLETED")}
                                    style={{ background: "#2e7d32", borderRadius: "8px", border: "none", padding: "0.6rem" }}
                                >
                                    ✅ Completed
                                </button>
                                <button
                                    className="btn w-100 fw-semibold text-white"
                                    onClick={() => updateStatus(activeModal.appointment, "CANCELLED")}
                                    style={{ background: "#c62828", borderRadius: "8px", border: "none", padding: "0.6rem" }}
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