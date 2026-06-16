import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Doctorreg() {
    const navigate = useNavigate();
    const [doctorName, setDoctorName] = useState("");
    const [doctorDepartment, setDoctorDepartment] = useState("");
    const [availabilitySchedule, setAvailabilitySchedule] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const regemail = localStorage.getItem("email1");

    const buttonHandler = () => {
    setError("");
    setSuccess("");

    if (regemail !== email) {
        setError("The registration email should be same");
        return;
    }

    if (loading) return;
    setLoading(true);

    const url = "http://localhost:9002/api/doctor/add";

    // ✅ Fixed: wrapped in { doctor: {...} }
    const data = {
        doctor: {
            name: doctorName.trim(),
            department: doctorDepartment.trim(),
            availabilitySchedule: availabilitySchedule.trim(),
            email: email
        }
    };

    axios.post(url, data)
    .then(() => {
        setSuccess("Doctor registered successfully! Redirecting to login...");
        localStorage.removeItem("email1");
        setTimeout(() => navigate("/login"), 1000);
        setDoctorName("");
        setDoctorDepartment("");
        setAvailabilitySchedule("");
        setEmail("");
        setLoading(false);
    })
    .catch((err) => {
        // ✅ Fixed: extract message string not whole object
        const msg = err.response?.data?.message
            || err.response?.data?.error
            || err.message
            || "Registration failed. Please try again.";
        setError(msg);
        setLoading(false);
    });
};

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center py-4 px-3"
            style={{ background: "linear-gradient(135deg, #e8f4f8 0%, #d6eaf8 50%, #eaf4fb 100%)" }}
        >
            <div
                className="card shadow-lg border-0"
                style={{ width: "100%", maxWidth: 480, borderRadius: "16px" }}
            >
                <div className="card-body p-4 p-md-5">

                    {}
                    <div className="text-center mb-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                            style={{ width: 64, height: 64, background: "#1a73a7" }}
                        >
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <rect x="12" y="4" width="8" height="24" rx="2" fill="white"/>
                                <rect x="4" y="12" width="24" height="8" rx="2" fill="white"/>
                            </svg>
                        </div>
                        <h5 className="fw-bold mb-1" style={{ color: "#1a3c5e" }}>MediServe</h5>
                        <p className="small mb-0" style={{ color: "#5a8fa8" }}>
                            Complete your doctor profile
                        </p>
                    </div>

                    {}
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <hr className="flex-grow-1 m-0" style={{ borderColor: "#c8dfe9" }} />
                        <span className="small px-2 py-1 rounded-pill fw-semibold"
                            style={{ background: "#e3f2fb", color: "#1a73a7", fontSize: "0.7rem", letterSpacing: "0.06em" }}>
                            DOCTOR REGISTRATION
                        </span>
                        <hr className="flex-grow-1 m-0" style={{ borderColor: "#c8dfe9" }} />
                    </div>

                    {}
                    {error && (
                        <div className="alert alert-danger py-2 small" role="alert">
                            ⚠️ {error}
                        </div>
                    )}
                    {success && (
                        <div className="alert alert-success py-2 small" role="alert">
                            ✅ {success}
                        </div>
                    )}

                    <form onSubmit={(e) => { e.preventDefault(); buttonHandler(); }}>

                        {}
                        <div className="mb-3">
                            <label className="form-label small fw-semibold" style={{ color: "#1a3c5e" }}>
                                Doctor Name <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Dr. John Smith"
                                value={doctorName}
                                onChange={(e) => setDoctorName(e.target.value)}
                                pattern="[A-Za-z\s]+"
                                title="Only letters allowed"
                                style={{ borderColor: "#b0cfe0", borderRadius: "8px" }}
                                required
                            />
                        </div>

                        {}
                        <div className="mb-3">
                            <label className="form-label small fw-semibold" style={{ color: "#1a3c5e" }}>
                                Department <span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                                className="form-select"
                                value={doctorDepartment}
                                onChange={(e) => setDoctorDepartment(e.target.value)}
                                style={{ borderColor: "#b0cfe0", borderRadius: "8px", color: doctorDepartment ? "#212529" : "#6c757d" }}
                                required
                            >
                                <option value="" disabled>Select department</option>
                                <option value="cardiology">Cardiology</option>
                                <option value="neurology">Neurology</option>
                                <option value="orthopedics">Orthopedics</option>
                                <option value="pediatrics">Pediatrics</option>
                                <option value="oncology">Oncology</option>
                                <option value="radiology">Radiology</option>
                                <option value="emergency">Emergency Medicine</option>
                                <option value="gynecology">Gynecology & Obstetrics</option>
                                <option value="gastro">Gastroenterology</option>
                                <option value="pulmonology">Pulmonology</option>
                                <option value="nephrology">Nephrology</option>
                                <option value="dermatology">Dermatology</option>
                                <option value="psychiatry">Psychiatry</option>
                                <option value="ent">ENT - Ear, Nose & Throat</option>
                                <option value="urology">Urology</option>
                            </select>
                        </div>

                        {}
                        <div className="mb-3">
                            <label className="form-label small fw-semibold" style={{ color: "#1a3c5e" }}>
                                Email Address <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="john@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ borderColor: "#b0cfe0", borderRadius: "8px" }}
                                required
                            />
                        </div>

                        {}
                        <div className="mb-4">
                            <label className="form-label small fw-semibold" style={{ color: "#1a3c5e" }}>
                                Availability (HH:mm-HH:mm) <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="08:00-20:00"
                                value={availabilitySchedule}
                                onChange={(e) => setAvailabilitySchedule(e.target.value)}
                                pattern="^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$"
                                title="Enter time range like 08:00-20:00"
                                style={{ borderColor: "#b0cfe0", borderRadius: "8px" }}
                                required
                            />
                        </div>

                        {}
                        <button
                            type="submit"
                            className="btn w-100 fw-semibold text-white"
                            disabled={loading}
                            style={{ background: "#1a73a7", borderRadius: "8px", border: "none", padding: "0.6rem" }}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Submitting...
                                </>
                            ) : "🩺 Complete Registration"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}