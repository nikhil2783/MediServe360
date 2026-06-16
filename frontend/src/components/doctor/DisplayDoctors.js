import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function DisplayDoctors() {

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9002/api/doctor/getAll", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, []);

  // Search filter
  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      {}
      <div className="d-flex justify-content-between align-items-center mb-3">

        <h2 className="mb-0">All Doctors</h2>

        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search by name / department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "250px" }}
          />

          <button className="btn btn-primary">
            <i className="bi bi-search"></i>
          </button>
        </div>

      </div>

      {filteredDoctors.length === 0 ? (
        <p className="text-danger">No doctors found</p>
      ) : (

        <div className="table-responsive">

          <table className="table table-bordered table-hover table-striped">

            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Availability</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {filteredDoctors.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.department}</td>
                  <td>{d.availabilitySchedule}</td>

                  <td className="text-center">
                    <Link
                      className="btn btn-warning btn-sm"
                      to={`/doctor/update/${d.id}`}
                    >
                      Update
                    </Link>
                  </td>

                  <td className="text-center">
                    <Link
                      className="btn btn-danger btn-sm"
                      to={`/doctor/delete/${d.id}`}
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

