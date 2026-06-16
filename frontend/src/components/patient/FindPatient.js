import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function FindPatient() {
  const [name, setName] = useState("");
  const [searched, setSearched] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Input handler 
  const nameHandler = (e) => {
    setName(e.target.value);
  };

  // Search function
  const buttonHandler = async () => {
    try {
      if (!name.trim()) {
        toast.warning("Please enter a name");
        return;
      }

      setLoading(true);
      setRecords([]);
      setSearched(false);

      const url =
        "http://localhost:9002/api/patient/getPatientByName/" + name.trim();

      const res = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      setRecords(res.data.patients || []);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setRecords([]);
      } else {
        toast.error(err.response?.data || err.message);
      }
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">

      {}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">

        <h4 className="mb-0">🔍 Find Patient</h4>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            buttonHandler();
          }}
          className="d-flex gap-2"
        >
          <input
            className="form-control"
            type="text"
            placeholder="Enter patient name"
            value={name}
            onChange={nameHandler}
            style={{ width: "250px" }}
            required
          />

          <button
            className="btn btn-primary"
            type="submit"
            disabled={!name.trim() || loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1"></span>
                Searching
              </>
            ) : (
              <>
                <i className="bi bi-search me-1"></i>
                Search
              </>
            )}
          </button>
        </form>

      </div>

      {}
      {searched && records.length === 0 && name && (
        <p className="text-danger fw-semibold">
          ❌ No patients found with this name
        </p>
      )}

      {}
      {records.length > 0 && (
        <div>

          <p className="mb-2 text-success">
            ✅ Found {records.length} patient(s)
          </p>

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
                </tr>
              </thead>

              <tbody>
                {records.map((e) => (
                  <tr key={e.patientId}>
                    <td>{e.patientId}</td>
                    <td>{e.patientName}</td>
                    <td>{new Date(e.patientDOB).toLocaleDateString()}</td>
                    <td>{e.patientGender}</td>
                    <td>{e.patientPhoneNumber}</td>
                    <td>{e.patientMedicalHistory}</td>

                    {}
                    <td>
                      <span
                        className={`badge 
                          ${e.patientStatus === "ADMITTED" ? "bg-success" : ""}
                          ${e.patientStatus === "REGISTERED" ? "bg-primary" : ""}
                          ${e.patientStatus === "DISCHARGED" ? "bg-secondary" : ""}
                        `}
                      >
                        {e.patientStatus}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      )}
    </div>
  );
}
