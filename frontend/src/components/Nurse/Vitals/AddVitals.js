// src/components/Nurse/Vitals/AddVitals.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PatientSearch from "../PatientSearch";

export default function AddVitals() {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [form, setForm] = useState({
        bloodPressure: "",
        temperature: "",
        pulseRate: "",
        spo2: ""
    });
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const nurseId = parseInt(localStorage.getItem("userId"));
    const token = localStorage.getItem("token");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient);
        setSuccess("");
        setError("");
    };

    const handleSubmit = () => {
        if (!selectedPatient) { setError("Please select a patient first."); return; }
        if (!form.bloodPressure && !form.temperature && !form.pulseRate && !form.spo2) {
            setError("Please fill in at least one vital."); return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        axios.post("http://localhost:9002/api/vitals/add", {
            patientId: selectedPatient.patientId,
            nurseId,
            bloodPressure: form.bloodPressure || null,
            temperature: form.temperature ? parseFloat(form.temperature) : null,
            pulseRate: form.pulseRate ? parseInt(form.pulseRate) : null,
            spo2: form.spo2 ? parseInt(form.spo2) : null,
        }, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
            setSuccess(`Vitals recorded successfully for ${selectedPatient.patientName}!`);
            setForm({ bloodPressure: "", temperature: "", pulseRate: "", spo2: "" });
            setSelectedPatient(null);
        })
        .catch(() => setError("Failed to save vitals. Please try again."))
        .finally(() => setLoading(false));
    };

    return (
        <div>

            {}
            <div className="d-flex align-items-start justify-content-between mb-4">
                <div>
                    <h4 className="fw-bold text-dark mb-1">
                        <i className="bi bi-heart-pulse-fill text-danger me-2"></i>
                        Add Patient Vitals
                    </h4>
                    <p className="text-muted small mb-0">Search a patient and record their vitals</p>
                </div>
                <div className="d-flex gap-2">
                    <Link
                        to="/nursedd/vitals/view"
                        className="btn btn-outline-danger d-flex align-items-center gap-2 px-3 py-2"
                        style={{ borderRadius: "10px", fontSize: "0.875rem", fontWeight: "500" }}
                    >
                        <i className="bi bi-heart-pulse-fill"></i>
                        View Vitals
                    </Link>
                    <Link
                        to="/nursedd/dashboard"
                        className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 shadow-sm"
                        style={{ borderRadius: "10px", fontSize: "0.875rem", fontWeight: "500" }}
                    >
                        <i className="bi bi-grid-fill"></i>
                        Nurse Dashboard
                        <i className="bi bi-arrow-right" style={{ fontSize: "0.85rem" }}></i>
                    </Link>
                </div>
            </div>

            {}
            <div className="card mb-4">
                <div className="card-header fw-semibold" style={{ backgroundColor: "#e7f1ff" }}>
                    Step 1 — Search and select a patient
                </div>
                <div className="card-body">
                    <PatientSearch onSelect={handleSelectPatient} />
                </div>
            </div>

            {}
            {selectedPatient && (
                <div className="alert alert-success d-flex justify-content-between align-items-center mb-4">
                    <span>
                        ✅ Selected: <strong>{selectedPatient.patientName}</strong>
                        &nbsp;(ID: {selectedPatient.patientId}, {selectedPatient.patientGender})
                    </span>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setSelectedPatient(null)}>
                        Change
                    </button>
                </div>
            )}

            {}
            <div className="card mb-4">
                <div className="card-header fw-semibold" style={{ backgroundColor: "#e7f1ff" }}>
                    Step 2 — Enter vitals
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">Blood Pressure</label>
                            <input type="text" className="form-control" name="bloodPressure"
                                placeholder="e.g. 120/80" value={form.bloodPressure} onChange={handleChange} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Temperature (°C)</label>
                            <input type="number" className="form-control" name="temperature"
                                placeholder="e.g. 37.5" value={form.temperature} onChange={handleChange} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Pulse Rate (bpm)</label>
                            <input type="number" className="form-control" name="pulseRate"
                                placeholder="e.g. 72" value={form.pulseRate} onChange={handleChange} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">SpO₂ (%)</label>
                            <input type="number" className="form-control" name="spo2"
                                placeholder="e.g. 98" value={form.spo2} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <button className="btn btn-primary" onClick={handleSubmit}
                            disabled={loading || !selectedPatient}>
                            {loading ? "Saving..." : "Save Vitals"}
                        </button>
                    </div>
                </div>
            </div>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
}
