import { useEffect, useState } from "react";
import axios from "axios";

export default function DisplayKpi() {

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchKpis = async () => {
      try {
        const url = "http://localhost:9002/api/kpi-report/fetchAllKPIReports";

        const res = await axios.get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        });

        

        setRecords(res.data || []);

      } catch (err) {
        console.error("❌ Error fetching KPI data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();

  }, []);

  return (
    <div className="container mt-4">
      <h2>KPI Reports</h2>

      {}
      {loading && <p>Loading...</p>}

      {}
      {!loading && records.length === 0 && (
        <div className="alert alert-warning mt-3">
          No Data Found
        </div>
      )}

      {}
      {!loading && records.length > 0 && (
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
            {records.map((e) => {

              

              return (
                <tr key={e.kpiId}>
                  <td>{e.kpiId}</td>
                  <td>{e.kpiReportScope}</td>
                  <td>{e.kpiMetrics}</td>

                  <td>
                    {e.kpiGeneratedDate
                      ? new Date(e.kpiGeneratedDate).toLocaleDateString()
                      : "N/A"}
                  </td>

                  {}
                  <td>
                    {
                      e.complianceReport?.reportId ??
                      e.complianceReport?.id ??
                      e.complianceReportId ??
                      "N/A"
                    }
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      )}

    </div>
  );
}