import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UpdateCompliance() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [scope, setScope] = useState("");
  const [metrics, setMetrics] = useState("");
  const [date, setDate] = useState("");

  //  Date error state (NEW)
  const [dateError, setDateError] = useState("");

  //  Today's date
  const todayDate = new Date().toISOString().split("T")[0];

  // Fetch existing record
  useEffect(() => {

    const fetchReport = async () => {
      try {
        const url = "http://localhost:9002/api/compliance-reports/fetchAllComplianceReports";

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const report = res.data.find(r => r.reportId == id);

        if (report) {
          setScope(report.reportScope);
          setMetrics(report.reportMetrics);
          setDate(report.reportGeneratedDate);
        } else {
          toast.error("Report not found");
          navigate("/compliance_report/display");
        }

      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    };

    fetchReport();

  }, [id, navigate]);

  // Scope validation (letters only)
  const scopeHandler = (e) => {
    const value = e.target.value;

    if (/^[A-Za-z ]*$/.test(value)) {
      setScope(value);
    }
  };

  //  Update handler
  const updateButtonHandler = async () => {

    // Empty validation
    if (!scope.trim() || !metrics.trim() || !date) {
      toast.warning("Please fill all required fields");
      return;
    }

    // Scope validation
    if (!/^[A-Za-z ]+$/.test(scope)) {
      toast.warning("Scope should contain only letters");
      return;
    }

    // Check if date has error
    if (dateError) {
      return;
    }

    try {
      const url = "http://localhost:9002/api/compliance-reports/updateComplianceReport";

      const data = {
        complianceReport: {
          reportId: id,
          reportScope: scope,
          reportMetrics: metrics,
          reportGeneratedDate: date
        }
      };

      await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      toast.success("Compliance Report updated successfully");

      setTimeout(() => {
        navigate("/compliance_report/display");
      }, 1000);

    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Update Compliance Report {id}</h2>

      {}
      <div className="mb-3">
        <label className="form-label">Report ID</label>
        <input className="form-control" value={id} readOnly />
      </div>

      {}
      <div className="mb-3">
        <label className="form-label">
          Scope <span style={{ color: "red" }}>*</span>
        </label>
        <input
          className="form-control"
          value={scope}
          onChange={scopeHandler}
          placeholder="Only letters allowed"
        />
      </div>

      {}
      <div className="mb-3">
        <label className="form-label">
          Metrics <span style={{ color: "red" }}>*</span>
        </label>
        <input
          className="form-control"
          value={metrics}
          onChange={(e) => setMetrics(e.target.value)}
        />
      </div>

      {}
      <div className="mb-3">
        <label className="form-label">
          Date <span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="date"
          className={`form-control ${dateError ? "is-invalid" : ""}`}
          value={date}
          onChange={(e) => {
            const value = e.target.value;
            setDate(value);

            if (value > todayDate) {
              setDateError("Future dates are not allowed");
            } else {
              setDateError("");
            }
          }}
          max={todayDate}
        />

        {}
        {dateError && (
          <div className="invalid-feedback">
            {dateError}
          </div>
        )}
      </div>

      {}
      <button className="btn btn-warning w-100" onClick={updateButtonHandler}>
        Update Compliance Report
      </button>
    </div>
  );
}