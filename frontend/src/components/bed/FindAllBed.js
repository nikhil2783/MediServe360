import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function FindAllBeds() {

    const [bedArr,     setBedArr]     = useState([]);
    // ✅ Patient lookup map: { patientId: patientName }
    const [patientMap, setPatientMap] = useState({});

    const headers = { Authorization: "Bearer " + localStorage.getItem("token") };

    useEffect(() => {
        // ✅ Fetch patients once for name lookup
        axios.get("http://localhost:9002/api/patient/fetchAllPatients", { headers })
            .then((res) => {
                const map = {};
                (res.data || []).forEach(p => {
                    map[p.patientId] = p.patientName;
                });
                setPatientMap(map);
            })
            .catch(() => {});

        axios.get("http://localhost:9002/api/beds/getAllBeds", { headers })
            .then((response) => setBedArr(response.data))
            .catch((error) => alert(error.message));
    }, []);

    return (
        <div className="container mt-4">
            <h2>All Beds</h2>

            <table className="table table-bordered table-striped mt-3">
                <thead className="table-dark">
                    <tr>
                        <th>Bed ID</th>
                        <th>Ward</th>
                        <th>Bed Status</th>
                        <th>Patient ID</th>
                        <th>Patient Name</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {bedArr.map((bed) => (
                        <tr key={bed.bedId}>
                            <td>{bed.bedId}</td>
                            <td>{bed.ward?.wardname || "-"}</td>
                            <td>
                                <span className={`badge ${bed.bedStatus === "OCCUPIED" ? "bg-danger" : "bg-success"}`}>
                                    {bed.bedStatus}
                                </span>
                            </td>
                            <td>
                                {bed.patientId !== 0
                                    ? bed.patientId
                                    : <span className="text-muted">—</span>
                                }
                            </td>
                            {}
                            <td>
                                {bed.patientId !== 0
                                    ? patientMap[bed.patientId] || <span className="text-muted">Loading...</span>
                                    : <span className="text-muted">Not Assigned</span>
                                }
                            </td>
                            <td>
                                <Link className="btn btn-warning btn-sm" to={"/bed/update/" + bed.bedId}>
                                    Update
                                </Link>
                            </td>
                            <td>
                                <Link className="btn btn-danger btn-sm" to={"/bed/delete/" + bed.bedId}>
                                    Delete
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}