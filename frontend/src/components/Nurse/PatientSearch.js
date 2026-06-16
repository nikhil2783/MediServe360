// src/components/Nurse/PatientSearch.jsx
import { useState } from "react";
import axios from "axios";

export default function PatientSearch({ onSelect }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const search = () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setSearched(false);

    const token = localStorage.getItem("token");  // ✅ get token

    axios.get(`http://localhost:9002/api/patient/search?name=${query}`, {
        headers: {
            Authorization: `Bearer ${token}`      // ✅ send token
        }
    })
    .then((res) => {
        setResults(res.data);
        setSearched(true);
    })
    .catch(() => setError("Failed to search patients. Please try again."))
    .finally(() => setLoading(false));
};

    const handleKeyDown = (e) => {
        if (e.key === "Enter") search();
    };

    return (
        <div>
            {}
            <div className="input-group mb-3" style={{ maxWidth: "500px" }}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search patient by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="btn btn-primary"
                    onClick={search}
                    disabled={loading}
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {}
            {error && (
                <div className="alert alert-danger py-2">{error}</div>
            )}

            {}
            {searched && results.length === 0 && (
                <div className="alert alert-warning py-2">
                    No patients found for "{query}".
                </div>
            )}

            {}
            {results.length > 0 && (
                <table className="table table-bordered table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((p) => (
                            <tr key={p.patientId}>
                                <td>{p.patientId}</td>
                                <td>{p.patientName}</td>
                                <td>{p.patientGender}</td>
                                <td>{p.patientPhoneNumber}</td>
                                <td>
                                    <span className={`badge ${p.patientStatus === "Active" ? "bg-success" : "bg-secondary"}`}>
                                        {p.patientStatus}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => onSelect(p)}
                                    >
                                        Select
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}