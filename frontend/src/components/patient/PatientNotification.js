import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function PatientNotification() {
    const [id, setId] = useState("");
    const [searched, setSearched] = useState(false);
    const [patientData, setPatientData] = useState([]);

    async function submitHandler(event) {
        event.preventDefault();

        if (!id) {
            toast.warning("Please enter patient ID");
            return;
        }

        try {
            let url = `http://localhost:9002/notification/getpatientbyid/${id}`;
            let res = await axios.get(url,{
                headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            setPatientData(res.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setPatientData([]);
            } else {
                console.error(err.message);
            }
        }

        setSearched(true);
    }

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Find Patient Notifications</h3>

            <form onSubmit={submitHandler}>
                <div className="mb-3">
                    <label className="form-label">Enter Patient ID</label>
                    <input
                        className="form-control"
                        type="number"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="Enter patient ID"
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

            {searched && patientData.length === 0 && (
                <p className="mt-3 text-danger">No records found</p>
            )}

            {patientData.length > 0 && (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped mt-4">
                        <thead className="table-dark">
                            <tr>
                                <th>Notification Id</th>
                                <th>Patient Id</th>
                                <th>Status</th>
                                <th>Category</th>
                                <th>Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientData.map((m) => (
                                <tr key={m.notificationID}>
                                    <td>{m.notificationID}</td>
                                    <td>{m.patientID}</td>
                                    <td>{m.status}</td>
                                    <td>{m.category}</td>
                                    <td>{m.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}