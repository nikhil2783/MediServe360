import axios from "axios";
import { useState,useRef } from "react";
import { toast } from "react-toastify";

export default function AddCompliance() {

    const [scope, setScope] = useState("");
    const [metrics, setMetrics] = useState("");
    const [date, setDate] = useState("");
    const [kpiCategory, setKpiCategory] = useState("");
    const isSubmitting = useRef(false);


    
    const KPI_OPTIONS = [
        { value: "OCCUPANCY_RATE",             label: "Occupancy Rate" },
        { value: "APPOINTMENT_FULFILLMENT",    label: "Appointment Fulfillment" },
        { value: "CLAIM_SUCCESS_RATE",         label: "Claim Success Rate" },
        { value: "PATIENT_REGISTRATION_RATE",  label: "Patient Registration Rate" },
        { value: "BILLING_COLLECTION_RATE",    label: "Billing Collection Rate" },
        { value: "DISCHARGE_TURNAROUND_TIME",  label: "Discharge Turnaround Time" },
        { value: "AUDIT_COMPLIANCE_SCORE",     label: "Audit Compliance Score" },
        { value: "NOTIFICATION_RESPONSE_RATE", label: "Notification Response Rate" }
    ];

    const scopeHandler = (e) => {
        const value = e.target.value;

        if (/^[A-Za-z ]*$/.test(value)) {
            setScope(value);
        }
    };

    const metricsHandler = (e) => {
        setMetrics(e.target.value);
    };

    const dateHandler = (e) => {
        setDate(e.target.value);
    };

    const kpiCategoryHandler = (e) => {
        setKpiCategory(e.target.value);
    };

    const buttonHandler = () => {

        // Prevent duplicate submissions while a request is in flight
        if (isSubmitting.current) return;

        let url = "http://localhost:9002/api/compliance-reports/addComplianceReport";

        if (!scope.trim() || !metrics.trim() || !date || !kpiCategory) {
            toast.warning("Please fill all required fields including KPI category");
            return;
        }

        const scopeRegex = /^[A-Za-z ]+$/;
        if (!scopeRegex.test(scope)) {
            toast.warning("Scope should contain only letters");
            return;
        }

        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            toast.warning("Report date cannot be in the future");
            return;
        }

        let data = {
            complianceReport: {
                reportScope: scope,
                reportMetrics: metrics,
                reportGeneratedDate: date,
                kpiCategory: kpiCategory
            }
        };

        // Lock submissions before firing the request
        isSubmitting.current = true;

        axios.post(url, data, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(() => {
            toast.success("Compliance Report Added & KPI Auto-Generated");

            setScope("");
            setMetrics("");
            setDate("");
            setKpiCategory("");
        })
        .catch((error) => {
            toast.error(error.response?.data?.message || error.message);
        })
        .finally(() => {
            // Unlock once the request settles (success or error)
            isSubmitting.current = false;
        });
    };

    return (
        <div className="container mt-4">

            <h3 className="mb-4">Add Compliance Report</h3>

            {}
            <div className="mb-3">
                <label className="form-label">
                    Scope <span style={{ color: "red" }}>*</span>
                </label>
                <input
                    className="form-control"
                    type="text"
                    value={scope}
                    placeholder="Enter scope"
                    onChange={scopeHandler}
                />
            </div>

            {}
            <div className="mb-3">
                <label className="form-label">
                    Metrics <span style={{ color: "red" }}>*</span>
                </label>
                <input
                    className="form-control"
                    type="text"
                    value={metrics}
                    placeholder="Enter metrics"
                    onChange={metricsHandler}
                />
            </div>

            {}
            <div className="mb-3">
                <label className="form-label">
                    Report Date <span style={{ color: "red" }}>*</span>
                </label>
                <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={dateHandler}
                    max={new Date().toISOString().split("T")[0]}
                />
            </div>

            {}
            <div className="mb-3">
                <label className="form-label">
                    KPI Category <span style={{ color: "red" }}>*</span>
                </label>
                <select
                    className="form-select"
                    value={kpiCategory}
                    onChange={kpiCategoryHandler}
                >
                    <option value="">-- Select KPI category --</option>
                    {KPI_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            <button className="btn btn-primary w-100" onClick={buttonHandler}>
                Add Compliance Report
            </button>

        </div>
    );
}