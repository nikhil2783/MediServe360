import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AddKpi() {

    const [scope, setScope] = useState("");
    const [metrics, setMetrics] = useState("");
    const [date, setDate] = useState("");
    const [complianceId, setComplianceId] = useState("");

    //Scope - only alphabets
    const scopeHandler = (event) => {
        const value = event.target.value;

        if (/^[A-Za-z ]*$/.test(value)) {
            setScope(value);
        }
    };

    const metricsHandler = (event) => {
        setMetrics(event.target.value);
    };

    const dateHandler = (event) => {
        setDate(event.target.value);
    };

    //Allow only numbers for complianceId
    const complianceIdHandler = (event) => {
        const value = event.target.value;

        if (/^[0-9]*$/.test(value)) {
            setComplianceId(value);
        }
    };

    const buttonHandler = () => {

        const url = "http://localhost:9002/api/kpi-report/addKPIReport";

        //  Empty validation
        if (!scope.trim() || !metrics.trim() || !date || !complianceId) {
            toast.warning("Please fill all required fields");
            return;
        }

        //  Scope validation
        if (!/^[A-Za-z ]+$/.test(scope)) {
            toast.warning("Scope should contain only letters");
            return;
        }

        //  Date validation
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            toast.warning("KPI date cannot be in the future");
            return;
        }

        const data = {
            kpiReport: {
                kpiReportScope: scope,
                kpiMetrics: metrics,
                kpiGeneratedDate: date,
                complianceReport: {
                    reportId: complianceId
                }
            }
        };

        axios.post(url, data, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(() => {

            toast.success("KPI Report added successfully");

            //  Reset form
            setScope("");
            setMetrics("");
            setDate("");
            setComplianceId("");

        })
        .catch((error) => {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Error adding KPI Report"
            );
        });
    };

    return (
        <div className="container mt-4">
            <h2>Add KPI Report</h2>

            {}
            <div className="mb-3">
                <label className="form-label">
                    Scope <span style={{ color: "red" }}>*</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    value={scope}
                    onChange={scopeHandler}
                    placeholder="Enter scope"
                />
            </div>

            {}
            <div className="mb-3">
                <label className="form-label">
                    Metrics <span style={{ color: "red" }}>*</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    value={metrics}
                    onChange={metricsHandler}
                    placeholder="Enter metrics"
                />
            </div>

            {}
            <div className="mb-3">
                <label className="form-label">
                    Date <span style={{ color: "red" }}>*</span>
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
                    Compliance Report ID <span style={{ color: "red" }}>*</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    value={complianceId}
                    onChange={complianceIdHandler}
                    placeholder="Enter report ID"
                />
            </div>

            <button className="btn btn-primary w-100" onClick={buttonHandler}>
                Add KPI Report
            </button>
        </div>
    );
}