import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DisplayAppointmentsPaginated() {

  const [records, setRecords] = useState([]);
  const [pgno, setPgno] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 10;

  const [sorting, setSorting] = useState("id");
  const [asc, setAsc] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async (page = pgno, sortCol = sorting, order = asc) => {
    try {
      setLoading(true);

      const url = "http://localhost:9002/api/appointment/getAllPaginated";

      const res = await axios.get(url, {
        params: {
          pgno: page,
          size: size,
          sorting: sortCol,
          asc: order
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      setRecords(res.data.content || []);
      setPgno(res.data.number);
      setTotalPages(res.data.totalPages);

    } catch (err) {
      toast.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(0);
  }, []);

  const handleSort = (column) => {
    if (sorting === column) {
      const newAsc = !asc;
      setAsc(newAsc);
      fetchAppointments(pgno, column, newAsc);
    } else {
      setSorting(column);
      setAsc(true);
      fetchAppointments(pgno, column, true);
    }
  };

  const sortArrow = (column) => {
    if (sorting !== column) return "";
    return asc ? " ↑" : " ↓";
  };

  return (
    <div className="container mt-4">

      <h3 className="mb-4">Appointments (Paginated)</h3>

      {loading && <p>Loading...</p>}

      {!loading && records.length === 0 && (
        <p className="text-danger">No appointments found</p>
      )}

      {records.length > 0 && (
        <>
          <div className="table-responsive">

            <table className="table table-bordered table-hover table-striped">

              <thead className="table-dark">
                <tr>
                  <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
                    Id{sortArrow("id")}
                  </th>

                  <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>
                    Date{sortArrow("date")}
                  </th>

                  <th onClick={() => handleSort("time")} style={{ cursor: "pointer" }}>
                    Time{sortArrow("time")}
                  </th>

                  <th>Duration</th>

                  <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                    Status{sortArrow("status")}
                  </th>

                  <th>Patient</th>
                  <th>Doctor</th>
                </tr>
              </thead>

              <tbody>
                {records.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{new Date(a.date).toLocaleDateString()}</td>
                    <td>{a.time}</td>
                    <td>{a.durationMinutes} min</td>
                    <td>{a.status}</td>
                    <td>{a.patient?.patientName}</td>
                    <td>{a.doctor?.name}</td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

          {}
          <div className="d-flex justify-content-between mt-3">

            <button
              className="btn btn-secondary"
              disabled={pgno === 0 || loading}
              onClick={() => fetchAppointments(pgno - 1)}
            >
              Prev
            </button>

            <span className="align-self-center">
              Page {pgno + 1} of {totalPages}
            </span>

            <button
              className="btn btn-secondary"
              disabled={pgno >= totalPages - 1 || loading}
              onClick={() => fetchAppointments(pgno + 1)}
            >
              Next
            </button>

          </div>
        </>
      )}

    </div>
  );
}