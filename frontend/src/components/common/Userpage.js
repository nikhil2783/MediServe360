import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Userpage() {

    const [data,       setData]       = useState([]);
    const [count,      setCount]      = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading,    setLoading]    = useState(false);

    const size = 10;

    const nexthandler = () => {
        if (count < totalPages - 1) setCount(count + 1);
    };

    const prevhandler = () => {
        if (count > 0) setCount(count - 1);
    };

    useEffect(() => {
        async function fetchfunction() {
            setLoading(true);
            try {
                const res = await axios.get(
                    `http://localhost:9002/user/fetchAllUsersPaginated`,
                    {
                        params: {
                            pgno:    count,
                            size:    size,
                            sorting: "userId",
                            asc:     true
                        },
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token")
                        }
                    }
                );
                setData(res.data.content || []);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                toast.error(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchfunction();
    }, [count]);

    return (
        <div className="container mt-4 table-responsive">

            {loading && <p className="text-muted">Loading...</p>}

            {!loading && data.length === 0 && (
                <p className="text-danger">No users found</p>
            )}

            {data.length > 0 && (
                <>
                    <table className="table table-bordered table-striped mt-3">
                        <thead className="table-dark">
                            <tr>
                                <th>User ID</th>
                                <th>User Name</th>
                                <th>Role</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((m) => (
                                <tr key={m.userId}>
                                    <td>{m.userId}</td>
                                    <td>{m.userName}</td>
                                    <td>{m.userRole}</td>
                                    <td>{m.userEmail}</td>
                                    <td>{m.userPhone}</td>
                                    <td>
                                        <span className={`badge ${
                                            m.status === "ACCEPT"  ? "bg-success" :
                                            m.status === "PENDING" ? "bg-warning text-dark" :
                                            m.status === "REJECT"  ? "bg-danger" : "bg-secondary"
                                        }`}>
                                            {m.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                        <button
                            className="btn btn-outline-dark btn-sm"
                            onClick={prevhandler}
                            disabled={count === 0 || loading}
                        >
                            ← Prev
                        </button>
                        <span className="fw-semibold">
                            Page {count + 1} of {totalPages}
                        </span>
                        <button
                            className="btn btn-outline-dark btn-sm"
                            onClick={nexthandler}
                            disabled={count >= totalPages - 1 || loading}
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}