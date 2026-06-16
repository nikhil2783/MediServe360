// src/components/Nurse/CareNotes/ViewCareNotes.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PatientSearch from "../PatientSearch";

export default function ViewCareNotes() {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient);
        setError("");
        setNotes([]);
        fetchNotes(patient.patientId);
    };

    const fetchNotes = (patientId) => {
        setLoading(true);
        axios.get(`http://localhost:9002/api/care-notes/patient/${patientId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => setNotes(res.data))
        .catch(() => setError("Failed to fetch care notes."))
        .finally(() => setLoading(false));
    };

    return (
        <div>

            {}
            <div className="d-flex align-items-start justify-content-between mb-4">
                <div>
                    <h4 className="fw-bold text-dark mb-1">
                        <i className="bi bi-journal-text text-success me-2"></i>
                        View Care Notes
                    </h4>
                    <p className="text-muted small mb-0">Search a patient to view their care notes</p>
                </div>
                <div className="d-flex gap-2">
                    <Link
                        to="/nursedd/carenotes/add"
                        className="btn btn-outline-success d-flex align-items-center gap-2 px-3 py-2"
                        style={{ borderRadius: "10px", fontSize: "0.875rem", fontWeight: "500" }}
                    >
                        <i className="bi bi-pencil-fill"></i>
                        Add Note
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
                        ✅ Showing notes for: <strong>{selectedPatient.patientName}</strong>
                        &nbsp;(ID: {selectedPatient.patientId})
                    </span>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => { setSelectedPatient(null); setNotes([]); }}
                    >
                        Clear
                    </button>
                </div>
            )}

            {}
            {loading && (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-2 text-muted">Loading notes...</p>
                </div>
            )}

            {}
            {error && <div className="alert alert-danger">{error}</div>}

            {}
            {selectedPatient && !loading && notes.length === 0 && !error && (
                <div className="alert alert-warning">
                    No care notes recorded yet for {selectedPatient.patientName}.
                </div>
            )}

            {}
            {notes.length > 0 && (
                <div>
                    <h6 className="mb-3 text-muted">
                        {notes.length} note{notes.length > 1 ? "s" : ""} found for {selectedPatient.patientName}
                    </h6>
                    {notes.map((n, index) => (
                        <div className="card mb-3" key={n.noteId}>
                            <div
                                className="card-header d-flex justify-content-between align-items-center"
                                style={{ backgroundColor: "#f8f9fa" }}
                            >
                                <span className="fw-semibold text-success">Note #{notes.length - index}</span>
                                <small className="text-muted">
                                    <i className="bi bi-clock me-1"></i>
                                    {new Date(n.createdAt).toLocaleString()}
                                </small>
                            </div>
                            <div className="card-body">
                                <p className="mb-0" style={{ whiteSpace: "pre-wrap", lineHeight: "1.7" }}>
                                    {n.note}
                                </p>
                            </div>
                            <div className="card-footer text-muted" style={{ fontSize: "0.8rem" }}>
                                <i className="bi bi-person-fill me-1"></i>
                                Recorded by Nurse ID: {n.nurseId}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
