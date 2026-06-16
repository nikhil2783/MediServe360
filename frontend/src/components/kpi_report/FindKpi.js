import { useState } from "react";
import axios from "axios";

export default function FindKpi() {

    const [scope, setScope] = useState("");
    const [records, setRecords] = useState([]);
    const [error, setError] = useState("");

    const buttonHandler = async () => {
        setError("");
        setRecords([]);
        try {
            const res = await axios.get(
                "http://localhost:9002/api/kpi-report/fetchAllKPIReports",
                { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
            );

            let kpis = res.data || [];

            if (scope.trim()) {
                kpis = kpis.filter((e) =>
                    (e.kpiReportScope || "").toLowerCase().includes(scope.toLowerCase())
                );
            }

            if (kpis.length === 0) {
                setError("No KPI Found");
            }

            setRecords(kpis);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Find KPI Report</h2>

            <div className="input-group mb-3">
                <input
                    className="form-control"
                    placeholder="Enter Scope (leave empty to show all)"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") buttonHandler(); }}
                />
                <button className="btn btn-primary" onClick={buttonHandler}>
                    Search
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {records.length > 0 && (
                <table className="table table-bordered table-striped mt-3">
                    <thead className="table-dark">
                        <tr>
                            <th>KPI ID</th>
                            <th>Scope</th>
                            <th>Metrics</th>
                            <th>Date</th>
                            <th>Compliance Report ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((e) => (
                            <tr key={e.kpiId}>
                                <td>{e.kpiId}</td>
                                <td>{e.kpiReportScope}</td>
                                <td>{e.kpiMetrics}</td>
                                <td>{e.kpiGeneratedDate}</td>
                                {}
                                <td>{e.complianceReportId ?? "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}