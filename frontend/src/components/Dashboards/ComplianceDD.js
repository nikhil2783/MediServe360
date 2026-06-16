import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TopNavbar from "../common/TopNavbar";

const BASE = "http://localhost:9002";

export default function ComplianceDD() {
  const [complianceReports, setComplianceReports] = useState([]);
  const [kpiReports, setKpiReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Real operational KPI data from microservices
  const [occupancyRate, setOccupancyRate] = useState(null);
  const [appointmentFulfillmentRate, setAppointmentFulfillmentRate] =
    useState(null);
  const [claimSuccessRate, setClaimSuccessRate] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterScope, setFilterScope] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const today = new Date().toISOString().split("T")[0];
  const headers = { Authorization: "Bearer " + localStorage.getItem("token") };

  useEffect(() => {
    setLoading(true);

    Promise.allSettled([
      // ✅ Compliance + KPI reports
      axios.get(`${BASE}/api/compliance-reports/fetchAllComplianceReports`, {
        headers,
      }),
      axios.get(`${BASE}/api/kpi-report/fetchAllKPIReports`, { headers }),

      // ✅ Real operational KPIs from microservices
      axios.get(`${BASE}/api/beds/getAllBeds`, { headers }),
      axios.get(`${BASE}/api/appointment/getAll`, { headers }),
      axios.get(`${BASE}/api/insurance/fetchAllInsuranceClaims`, { headers }),
    ])
      .then(([compRes, kpiRes, bedsRes, apptsRes, claimsRes]) => {
        // Compliance reports
        if (compRes.status === "fulfilled")
          setComplianceReports(compRes.value.data || []);

        // KPI reports
        if (kpiRes.status === "fulfilled")
          setKpiReports(kpiRes.value.data || []);

        // ✅ Occupancy Rate = occupied beds / total beds * 100
        if (bedsRes.status === "fulfilled") {
          const beds = bedsRes.value.data || [];
          const occupied = beds.filter(
            (b) => b.bedStatus === "OCCUPIED",
          ).length;
          const total = beds.length;
          setOccupancyRate(total > 0 ? (occupied / total) * 100 : 0);
        }

        // ✅ Appointment Fulfillment Rate = completed / total * 100
        if (apptsRes.status === "fulfilled") {
          const appts = apptsRes.value.data || [];
          const completed = appts.filter(
            (a) => a.status === "COMPLETED",
          ).length;
          const total = appts.length;
          setAppointmentFulfillmentRate(
            total > 0 ? (completed / total) * 100 : 0,
          );
        }

        // ✅ Claim Success Rate = APPROVED claims / total claims * 100
        if (claimsRes.status === "fulfilled") {
          const claims = claimsRes.value.data || [];
          const approved = claims.filter(
            (c) => (c.status || "").toUpperCase() === "APPROVED",
          ).length;
          const total = claims.length;
          setClaimSuccessRate(total > 0 ? (approved / total) * 100 : 0);
        }
      })
      .catch((err) =>
        toast.error(err.response?.data?.message || "Failed to load data"),
      )
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const filteredReports = useMemo(() => {
    return complianceReports.filter((r) => {
      const matchesSearch =
        !searchTerm ||
        (r.reportScope || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (r.reportMetrics || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesScope =
        filterScope === "ALL" || r.reportScope === filterScope;

      const matchesDateFrom =
        !dateFrom || new Date(r.reportGeneratedDate) >= new Date(dateFrom);
      const matchesDateTo =
        !dateTo || new Date(r.reportGeneratedDate) <= new Date(dateTo);

      return matchesSearch && matchesScope && matchesDateFrom && matchesDateTo;
    });
  }, [complianceReports, searchTerm, filterScope, dateFrom, dateTo]);

  const uniqueScopes = useMemo(() => {
    return [...new Set(complianceReports.map((r) => r.reportScope))];
  }, [complianceReports]);

  const fmt = (val) => (val != null ? `${val.toFixed(1)}%` : "N/A");

  const getKpiBadge = (val) => {
    if (val == null) return "secondary";
    if (val >= 80) return "success";
    if (val >= 50) return "warning";
    return "danger";
  };

  const handleExport = () => {
    if (filteredReports.length === 0) {
      toast.warning("No reports to export");
      return;
    }
    const csv = [
      ["Report ID", "Scope", "Metrics", "Date", "KPI Count"].join(","),
      ...filteredReports.map((r) => {
        const kpiCount = kpiReports.filter(
          (k) => k.complianceReportId === r.reportId,
        ).length;
        return [
          r.reportId,
          `"${r.reportScope}"`,
          `"${r.reportMetrics}"`,
          r.reportGeneratedDate,
          kpiCount,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `compliance_reports_${today}.csv`;
    link.click();
    toast.success(`Exported ${filteredReports.length} reports`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterScope("ALL");
    setDateFrom("");
    setDateTo("");
  };

  if (loading) {
    return (
      <>
        <TopNavbar />
        <div className="container mt-5 text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading data...</p>
        </div>
      </>
    );
  }

  return (
    <div>
      <TopNavbar />
      <div className="container-fluid py-4 px-4">
        {}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h3 className="mb-1">📊 Reports & Analytics</h3>
            <small className="text-muted">
              Live operational metrics and report history
            </small>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setRefreshKey((k) => k + 1)}
            >
              🔄 Refresh
            </button>
            <button className="btn btn-success btn-sm" onClick={handleExport}>
              ⬇ Export CSV
            </button>
          </div>
        </div>

        {}
        <h6 className="text-muted mb-2">Live Operational KPIs</h6>
        <div className="row g-3 mb-4">
          {[
            {
              label: "🛏️ Occupancy Rate",
              value: occupancyRate,
              desc: "Beds occupied across wards",
              color: "primary",
              badge:
                occupancyRate >= 80
                  ? "High"
                  : occupancyRate >= 50
                    ? "Normal"
                    : "Low",
            },
            {
              label: "📅 Appointment Fulfillment",
              value: appointmentFulfillmentRate,
              desc: "Completed vs scheduled",
              color: "success",
              badge:
                appointmentFulfillmentRate >= 80
                  ? "Good"
                  : appointmentFulfillmentRate >= 50
                    ? "OK"
                    : "Poor",
            },
            {
              label: "💰 Claim Success Rate",
              value: claimSuccessRate,
              desc: "Claims approved vs submitted",
              color: "info",
              badge:
                claimSuccessRate >= 80
                  ? "Healthy"
                  : claimSuccessRate >= 50
                    ? "Average"
                    : "At Risk",
            },
          ].map((kpi) => (
            <div className="col-md-4" key={kpi.label}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <small className="text-muted">{kpi.label}</small>
                    <span className={`badge bg-${getKpiBadge(kpi.value)}`}>
                      {kpi.badge}
                    </span>
                  </div>
                  <h2 className="mb-0 mt-2">{fmt(kpi.value)}</h2>
                  <div className="progress mt-2" style={{ height: "6px" }}>
                    <div
                      className={`progress-bar bg-${kpi.color}`}
                      style={{ width: `${kpi.value || 0}%` }}
                    ></div>
                  </div>
                  <small className="text-muted mt-1 d-block">{kpi.desc}</small>
                </div>
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="row g-3 mb-4">
          {[
            {
              label: "Total Compliance Reports",
              value: complianceReports.length,
              color: "primary",
            },
            {
              label: "KPIs Auto-Generated",
              value: kpiReports.length,
              color: "success",
            },
            {
              label: "Filtered Results",
              value: filteredReports.length,
              color: "info",
            },
          ].map((s) => (
            <div className="col-md-4 col-6" key={s.label}>
              <div className="card bg-light border-0 h-100">
                <div className="card-body text-center">
                  <small className="text-muted">{s.label}</small>
                  <h3 className={`mb-0 mt-1 text-${s.color}`}>{s.value}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {}
        <h6 className="text-muted mb-2">Modules</h6>
        <div className="row g-3 mb-4">
          <div className="col-6 col-sm-4 col-md-3">
            <Link
              to="/compliance_report"
              className="btn btn-outline-dark w-100 py-4 d-flex flex-column align-items-center gap-2 text-decoration-none"
              style={{ borderRadius: "12px", minHeight: "100px" }}
            >
              <span style={{ fontSize: "1.8rem" }}>📋</span>
              <span className="fw-semibold small">Compliance Reports</span>
            </Link>
          </div>
          <div className="col-6 col-sm-4 col-md-3">
            <Link
              to="/kpi_report"
              className="btn btn-outline-dark w-100 py-4 d-flex flex-column align-items-center gap-2 text-decoration-none"
              style={{ borderRadius: "12px", minHeight: "100px" }}
            >
              <span style={{ fontSize: "1.8rem" }}>📈</span>
              <span className="fw-semibold small">KPI Reports</span>
            </Link>
          </div>
        </div>

        {}
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body">
            <h6 className="card-title mb-3">🔍 Filter Reports</h6>
            <div className="row g-2">
              <div className="col-md-4">
                <label className="form-label small">Search</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search scope or metrics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small">Scope</label>
                <select
                  className="form-select form-select-sm"
                  value={filterScope}
                  onChange={(e) => setFilterScope(e.target.value)}
                >
                  <option value="ALL">All Scopes</option>
                  {uniqueScopes.map((scope) => (
                    <option key={scope} value={scope}>
                      {scope}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label small">From</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label small">To</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <button
                  className="btn btn-outline-secondary btn-sm w-100"
                  onClick={clearFilters}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h6 className="card-title mb-3">
              📑 Reports ({filteredReports.length} of {complianceReports.length}
              )
            </h6>
            {filteredReports.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <p>No reports match the current filters.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Scope</th>
                      <th>Metrics</th>
                      <th>Date</th>
                      <th className="text-center">KPIs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((r) => {
                      const linkedKpis = kpiReports.filter(
                        (k) => k.complianceReportId === r.reportId,
                      );
                      return (
                        <tr key={r.reportId}>
                          <td>
                            <span className="badge bg-secondary">
                              #{r.reportId}
                            </span>
                          </td>
                          <td className="fw-medium">{r.reportScope}</td>
                          <td>
                            <small className="text-muted">
                              {r.reportMetrics}
                            </small>
                          </td>
                          <td>
                            <small>{r.reportGeneratedDate}</small>
                          </td>
                          <td className="text-center">
                            <span
                              className="badge bg-info"
                              title={linkedKpis
                                .map((k) => k.kpiReportScope)
                                .join(", ")}
                            >
                              {linkedKpis.length}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
