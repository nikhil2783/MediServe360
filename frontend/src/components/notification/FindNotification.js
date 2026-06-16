import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function FindNotification() {

    const [id, setId] = useState("");
    const [data, setData] = useState({});
    const [searched, setSearched] = useState(false);

    const idHandler = (event) => {
        setId(event.target.value);
    };

    async function submitHandler(event) {
        event.preventDefault();

        if (!id) {
            toast.warning("Please enter Notification ID");
            return;
        }

        const url = `http://localhost:9002/notification/findNotificationById/${id}`;

        try {
            const res = await axios.get(url, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });

            setData(res.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setData({});
            } else {
                toast.error("No record found");
            }
        }

        setSearched(true);
    }

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Find Notification</h3>

            <form onSubmit={submitHandler}>
                <div className="mb-3">
                    <label className="form-label">Enter Notification ID</label>
                    <input
                        className="form-control"
                        type="number"
                        value={id}
                        onChange={idHandler}
                        placeholder="Enter Notification ID"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") submitHandler(e);
                        }}
                    />
                </div>

                <button
                    className="btn btn-primary w-100"
                    type="submit"
                    disabled={!id}
                >
                    Find
                </button>
            </form>

            {}
            {searched && !data.notificationId && (
                <p className="mt-3 text-danger">No records found</p>
            )}

            {}
            {data.notificationId && (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped mt-4">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Message</th>
                                <th>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{data.notificationId}</td>
                                <td>{data.message}</td>
                                <td>{data.category}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}