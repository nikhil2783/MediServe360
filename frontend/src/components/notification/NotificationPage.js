import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function NotificationPage() {

    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const size = 6;

    const nextHandler = () => {
        if (count < totalPages - 1) {
            setCount(count + 1);
        }
    };

    const prevHandler = () => {
        if (count > 0) {
            setCount(count - 1);
        }
    };

    async function fetchData() {
        const url = `http://localhost:9002/notification/fetchAllNotificationsPaginated`;

        try {
            const res = await axios.get(url, {
                params: {
                    pgno: count,
                    size: size,
                    sorting: "notificationId",
                    asc: true
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });

            setData(res.data.content);
            setTotalPages(res.data.totalPages);

        } catch (err) {
            toast.error(err.message);
        }
    }

    useEffect(() => {
        fetchData();
    }, [count]);

    return (
        <div className="container mt-4">

            <h3 className="mb-4">Notification Audit Logs</h3>

            {data.length === 0 ? (
                <p>No records found</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover table-striped mt-3">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Message</th>
                                <th>Category</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((m) => (
                                <tr key={m.notificationId}>
                                    <td>{m.notificationId}</td>
                                    <td>{m.message}</td>
                                    <td>{m.category}</td>
                                    <td>{m.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {}
            <div className="d-flex justify-content-center align-items-center mt-3">

                <button
                    className="btn btn-secondary me-2"
                    onClick={prevHandler}
                    disabled={count === 0}
                >
                    Prev
                </button>

                <span>
                    Page {count + 1} of {totalPages}
                </span>

                <button
                    className="btn btn-secondary ms-2"
                    onClick={nextHandler}
                    disabled={count === totalPages - 1}
                >
                    Next
                </button>

            </div>
        </div>
    );
}