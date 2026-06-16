import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function DisplayCompliance() {

  const [reports, setReports] = useState([]);

  useEffect(() => {

    axios.get("http://localhost:9002/api/compliance-reports/fetchAllComplianceReports", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then((res) => {
      
      setReports(res.data);
    })
    .catch((err) => {
      console.log("Error:", err.response?.data || err.message);
      alert(err.response?.data || err.message);
    });

  }, []);

  return (
    <div className="container mt-4">
      <h2>Compliance Reports</h2>
      <div className="table-responsive">
      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Scope</th>
            <th>Metrics</th>
            <th>Date</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No Data Found
              </td>
            </tr>
          ) : (
            reports.map((r) => (
              <tr key={r.reportId}>
                <td>{r.reportId}</td>
                <td>{r.reportScope}</td>
                <td>{r.reportMetrics}</td>
                <td>{r.reportGeneratedDate}</td>
                <td>
                  <Link
                    className="btn btn-warning btn-sm"
                    to={`/compliance_report/update/${r.reportId}`}
                  >
                    Update
                  </Link>
                </td>
                <td>
                  <Link
                    className="btn btn-danger btn-sm"
                    to={`/compliance_report/delete/${r.reportId}`}
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>

    </div>
  );
}