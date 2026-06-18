import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function DisplayAppointments() {

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9002/api/appointment/getAll", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, []);

  const filteredAppointments = appointments.filter((a) =>
    (a.doctor?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.patient?.patientName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      {}
      <div className="d-flex justify-content-between align-items-center mb-3">

        <h2 className="mb-0">All Appointments</h2>

        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search by patient / doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "250px" }}
          />

          <button className="btn btn-primary">
            <i className="bi bi-search"></i>
          </button>
        </div>

      </div>

      {}
      {filteredAppointments.length === 0 ? (
        <p className="text-danger">No appointments found</p>
      ) : (

        <div className="table-responsive">

          <table className="table table-bordered table-hover table-striped">

            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{new Date(a.date).toLocaleDateString()}</td>
                  <td>{a.time}</td>
                  <td>{a.durationMinutes} min</td>
                  <td>{a.status}</td>
                  <td>{a.patient?.patientName}</td>
                  <td>{a.doctor?.name}</td>

                  <td className="text-center">
                    <Link
                      className="btn btn-warning btn-sm"
                      to={`/appointment/edit/${a.id}`}
                    >
                      Update
                    </Link>
                  </td>

                  <td className="text-center">
                    <Link
                      className="btn btn-danger btn-sm"
                      to={`/appointment/delete/${a.id}`}
                    >
                      Delete
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}