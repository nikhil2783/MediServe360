import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE = "http://localhost:9002";

export default function FindDoctor() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const headers = {
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  async function handleChange(e) {
    const val = e.target.value;

    // ✅ Allow only letters and spaces
    if (val !== "" && !/^[a-zA-Z\s]*$/.test(val)) return;

    setQuery(val);

    if (!val.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(
        `${BASE}/api/doctor/search?name=${encodeURIComponent(val.trim())}`,
        { headers }
      );

      setResults(res.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setResults([]);
      } else {
        toast.error(err.response?.data?.message || err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3">

      {/* Header + Search */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <h4 className="mb-0 fw-bold">🩺 Find Doctor</h4>

        <div className="input-group" style={{ width: 280 }}>
          <span className="input-group-text">
            {loading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <i className="bi bi-search"></i>
            )}
          </span>
          <input
            className="form-control"
            type="text"
            placeholder="Search doctor by name..."
            value={query}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Empty state */}
      {!query && (
        <div className="text-center text-muted py-5">
          <i className="bi bi-search fs-2 d-block mb-2"></i>
          Start typing a doctor name to search
        </div>
      )}

      {/* No results */}
      {query && results.length === 0 && !loading && (
        <div className="text-center text-muted py-5">
          <i className="bi bi-person-slash fs-2 d-block mb-2"></i>
          No doctor found
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Availability</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {results.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.name ?? "—"}</td>
                  <td>{d.department ?? "—"}</td>
                  <td>{d.availabilitySchedule ?? "—"}</td>
                  <td>{d.email ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}