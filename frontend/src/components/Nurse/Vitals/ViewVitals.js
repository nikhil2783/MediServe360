// src/components/Nurse/Vitals/ViewVitals.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PatientSearch from "../PatientSearch";

export default function ViewVitals() {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [vitals, setVitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient);
        setError("");
        setVitals([]);
        fetchVitals(patient.patientId);
    };

    const fetchVitals = (patientId) => {
        setLoading(true);
        axios.get(`http://localhost:9002/api/vitals/patient/${patientId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => setVitals(res.data))
        .catch(() => setError("Failed to fetch vitals."))
        .finally(() => setLoading(false));
    };

    return (
        <div>

            {}
            <div className="d-flex align-items-start justify-content-between mb-4">
                <div>
                    <h4 className="fw-bold text-dark mb-1">
                        <i className="bi bi-heart-pulse-fill text-danger me-2"></i>
                        View Patient Vitals
                    </h4>
                    <p className="text-muted small mb-0">Search a patient to view their vitals history</p>
                </div>
                <div className="d-flex gap-2">
                    <Link
                        to="/nursedd/vitals/add"
                        className="btn btn-outline-danger d-flex align-items-center gap-2 px-3 py-2"
                        style={{ borderRadius: "10px", fontSize: "0.875rem", fontWeight: "500" }}
                    >
                        <i className="bi bi-plus-circle-fill"></i>
                        Add Vitals
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
                        ✅ Showing vitals for: <strong>{selectedPatient.patientName}</strong>
                        &nbsp;(ID: {selectedPatient.patientId})
                    </span>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => { setSelectedPatient(null); setVitals([]); }}
                    >
                        Clear
                    </button>
                </div>
            )}

            {}
            {loading && (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-2 text-muted">Loading vitals...</p>
                </div>
            )}

            {}
            {error && <div className="alert alert-danger">{error}</div>}

            {}
            {selectedPatient && !loading && vitals.length === 0 && !error && (
                <div className="alert alert-warning">
                    No vitals recorded yet for {selectedPatient.patientName}.
                </div>
            )}

            {}
            {vitals.length > 0 && (
                <div className="card">
                    <div className="card-header fw-semibold" style={{ backgroundColor: "#e7f1ff" }}>
                        Vitals History — {selectedPatient.patientName}
                    </div>
                    <div className="card-body p-0">
                        <table className="table table-bordered table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Blood Pressure</th>
                                    <th>Temperature (°C)</th>
                                    <th>Pulse Rate (bpm)</th>
                                    <th>SpO₂ (%)</th>
                                    <th>Recorded At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vitals.map((v, index) => (
                                    <tr key={v.vitalId}>
                                        <td>{index + 1}</td>
                                        <td>{v.bloodPressure ?? "—"}</td>
                                        <td>{v.temperature ?? "—"}</td>
                                        <td>{v.pulseRate ?? "—"}</td>
                                        <td>{v.spo2 ?? "—"}</td>
                                        <td>{new Date(v.recordedAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
