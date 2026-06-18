import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Userapproval() {
    const [actualData, setActualData] = useState([]);

    async function userApproval() {
        const url = "http://localhost:9002/user/fetchallusers";
        try {
            const res = await axios.get(url, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            const pending = res.data.filter((u) => u.status === "PENDING");
            setActualData(pending);
        } catch (err) {
            toast.error(err.message);
        }
    }

    async function arapproval(a, id) {
        try {
            await axios.put(`http://localhost:9002/user/approval/${a}/${id}`, {}, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            toast.success("User with id " + id + " successfully " + a + "ED");
            userApproval();
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    }

    useEffect(() => {
        userApproval();
    }, []);

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Pending User Approvals</h4>
                </div>
                <div className="card-body p-0">
                    {actualData.length === 0 ? (
                        <div className="text-center text-muted py-5">
                            <i className="fs-1">📭</i>
                            <p className="mt-2">No pending users found.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover table-striped mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th>User Id</th>
                                        <th>User Name</th>
                                        <th>User Role</th>
                                        <th>User Email</th>
                                        <th>Phone Number</th>
                                        <th>Status</th>
                                        <th>Accept</th>
                                        <th>Reject</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {actualData.map((m) => (
                                        <tr key={m.userId}>
                                            <td>{m.userId}</td>
                                            <td>{m.userName}</td>
                                            <td>
                                                <span className="badge bg-secondary">
                                                    {m.role}
                                                </span>
                                            </td>
                                            <td>{m.email}</td>
                                            <td>{m.phoneNumber}</td>
                                            <td>
                                                <span className="badge bg-warning text-dark">
                                                    {m.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => arapproval("ACCEPT", m.userId)}
                                                >
                                                    ✓ Accept
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => arapproval("REJECT", m.userId)}
                                                >
                                                    ✗ Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div className="card-footer text-muted text-end">
                    Total Pending: <strong>{actualData.length}</strong>
                </div>
            </div>
        </div>
    );
}