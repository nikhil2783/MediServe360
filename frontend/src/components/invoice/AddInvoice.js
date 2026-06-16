import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AddInvoice() {

    const [patientId,     setPatientId]     = useState("");
    const [amount,        setAmount]        = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [loading,       setLoading]       = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return;

        if (amount <= 0) {
            toast.warning("Amount must be greater than 0");
            return;
        }

        setLoading(true);

        const data = {
            invoice: {
                patient: { patientId: Number(patientId) },
                amount: Number(amount),
                invoiceDate: new Date().toISOString().split("T")[0], // ✅ Auto current date
                paymentStatus
            }
        };

        axios.post("http://localhost:9002/api/invoice/addInvoice", data, {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(() => {
            toast.success("Invoice added successfully");
            setPatientId("");
            setAmount("");
            setPaymentStatus("");
            setLoading(false);
        })
        .catch((err) => {
            toast.error(err.response?.data?.message || err.message);
            setLoading(false);
        });
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Add Invoice</h3>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label className="form-label">
                        Patient ID <span className="text-danger">*</span>
                    </label>
                    <input
                        className="form-control"
                        type="number"
                        value={patientId}
                        placeholder="Enter patient ID"
                        onChange={(e) => setPatientId(e.target.value === "" ? "" : Number(e.target.value))}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Amount <span className="text-danger">*</span>
                    </label>
                    <input
                        className="form-control"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={amount}
                        placeholder="Enter amount"
                        onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                        required
                    />
                </div>

                {}
                <div className="mb-3">
                    <label className="form-label">Invoice Date</label>
                    <input
                        className="form-control"
                        type="text"
                        value={new Date().toLocaleDateString()}
                        readOnly
                        style={{ backgroundColor: "#f8f9fa", cursor: "not-allowed" }}
                    />
                    <small className="text-muted">Automatically set to today's date</small>
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Payment Status <span className="text-danger">*</span>
                    </label>
                    <select
                        className="form-select"
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        required
                    >
                        <option value="">-- Select --</option>
                        <option value="PAID">PAID</option>
                        <option value="PENDING">PENDING</option>
                    </select>
                </div>

                <button
                    className="btn btn-primary w-100"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
                    ) : "Add Invoice"}
                </button>

            </form>
        </div>
    );
}