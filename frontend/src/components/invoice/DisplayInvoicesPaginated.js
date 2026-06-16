import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DisplayInvoicesPaginated() {

    const [records,     setRecords]     = useState([]);
    const [pgno,        setPgno]        = useState(0);
    const [totalPages,  setTotalPages]  = useState(0);
    const [sorting,     setSorting]     = useState("invoiceId");
    const [asc,         setAsc]         = useState(true);
    const [loading,     setLoading]     = useState(false);

    const size = 10;

    // ✅ Fixed: removed useCallback with [pgno,sorting,asc] deps — caused infinite loop
    async function fetchInvoices(page, sortCol, order) {
        try {
            setLoading(true);
            const res = await axios.get(
                "http://localhost:9002/api/invoice/fetchAllInvoicesPaginated",
                {
                    params: { pgno: page, size, sorting: sortCol, asc: order },
                    headers: { Authorization: "Bearer " + localStorage.getItem("token") }
                }
            );
            setRecords(res.data.content || []);
            setPgno(res.data.number);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchInvoices(0, "invoiceId", true);
    }, []);

    const handleSort = (column) => {
        if (sorting === column) {
            const newAsc = !asc;
            setAsc(newAsc);
            fetchInvoices(pgno, column, newAsc);
        } else {
            setSorting(column);
            setAsc(true);
            fetchInvoices(pgno, column, true);
        }
    };

    const sortArrow = (column) => {
        if (sorting !== column) return "";
        return asc ? " ↑" : " ↓";
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Display Invoices (Paginated)</h3>

            {loading && <p className="text-muted">Loading...</p>}

            {!loading && records.length === 0 && (
                <p className="text-danger">No invoices found</p>
            )}

            {records.length > 0 && (
                <>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th onClick={() => handleSort("invoiceId")} style={{ cursor: "pointer" }}>
                                        Invoice Id{sortArrow("invoiceId")}
                                    </th>
                                    <th>Patient Id</th>
                                    <th>Patient Name</th>
                                    <th onClick={() => handleSort("amount")} style={{ cursor: "pointer" }}>
                                        Amount{sortArrow("amount")}
                                    </th>
                                    <th onClick={() => handleSort("invoiceDate")} style={{ cursor: "pointer" }}>
                                        Invoice Date{sortArrow("invoiceDate")}
                                    </th>
                                    {}
                                    <th onClick={() => handleSort("paymentStatus")} style={{ cursor: "pointer" }}>
                                        Payment Status{sortArrow("paymentStatus")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((e) => (
                                    <tr key={e.invoiceId}>
                                        <td>{e.invoiceId}</td>
                                        <td>{e.patient?.patientId}</td>
                                        <td>{e.patient?.patientName}</td>
                                        <td>₹ {Number(e.amount).toFixed(2)}</td>
                                        <td>{new Date(e.invoiceDate).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${e.paymentStatus === "PAID" ? "bg-success" : "bg-warning text-dark"}`}>
                                                {e.paymentStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                        <button
                            className="btn btn-secondary"
                            disabled={pgno === 0 || loading}
                            onClick={() => fetchInvoices(pgno - 1, sorting, asc)}
                        >
                            Prev
                        </button>
                        <span className="align-self-center">
                            Page {pgno + 1} of {totalPages}
                        </span>
                        <button
                            className="btn btn-secondary"
                            disabled={pgno >= totalPages - 1 || loading}
                            onClick={() => fetchInvoices(pgno + 1, sorting, asc)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}