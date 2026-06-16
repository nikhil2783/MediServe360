import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function FindUser() {

    const [id, setId] = useState("");
    const [searched, setSearched] = useState(false);
    const [data, setData] = useState({});

    const idHandler = (event) => {
        setId(event.target.value);
    };

    async function submitHandler(event) {
        event.preventDefault();

        if (!id) {
            toast.warning("Please enter user ID");
            return;
        }

        const url = `http://localhost:9002/user/findbyid/${id}`;

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
                console.log(err.message);
            }
        }

        setSearched(true);
    }

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Find User by ID</h3>

            <form onSubmit={submitHandler}>
                <div className="mb-3">
                    <label className="form-label">Enter User ID</label>
                    <input
                        className="form-control"
                        type="number"
                        value={id}
                        onChange={idHandler}
                        placeholder="Enter user ID"
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
            {searched && !data.userId && (
                <p className="mt-3 text-danger">No records found</p>
            )}

            {data.userId && (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped mt-4">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Phone</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{data.userId}</td>
                                <td>{data.userName}</td>
                                <td>{data.role}</td>
                                <td>{data.phoneNumber}</td>
                                <td>{data.email}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
