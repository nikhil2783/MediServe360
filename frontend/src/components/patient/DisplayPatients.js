import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function DisplayPatients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9002/api/patient/fetchAllPatients", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setPatients(res.data);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.patientName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        {}
        <h2 className="mb-0">All Patients</h2>

        {}
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "250px" }}
          />

          <button className="btn btn-primary">
            <i className="bi bi-search"></i>
            Search
          </button>
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <p>No patients found</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Phone Number</th>
                <th>Medical History</th>
                <th>Status</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.map((e) => (
                <tr key={e.patientId}>
                  <td>{e.patientId}</td>
                  <td>{e.patientName}</td>
                  <td>{new Date(e.patientDOB).toLocaleDateString()}</td>
                  <td>{e.patientGender}</td>
                  <td>{e.patientPhoneNumber}</td>
                  <td>{e.patientMedicalHistory}</td>
                  <td>{e.patientStatus}</td>

                  <td className="text-center">
                    <Link
                      className="btn btn-warning btn-sm"
                      to={`/patient/update/${e.patientId}`}
                    >
                      Update
                    </Link>
                  </td>

                  <td className="text-center">
                    <Link
                      className="btn btn-danger btn-sm"
                      to={`/patient/delete/${e.patientId}`}
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
