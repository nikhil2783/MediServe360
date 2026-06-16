import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DisplayDoctorsPaginated() {

  const [records, setRecords] = useState([]);
  const [pgno, setPgno] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 10;

  const [sorting, setSorting] = useState("id");
  const [asc, setAsc] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async (page = pgno, sortCol = sorting, order = asc) => {
    try {
      setLoading(true);

      const url = "http://localhost:9002/api/doctor/getAllPaginated";

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
    fetchDoctors(0);
  }, []);

  const handleSort = (column) => {
    if (sorting === column) {
      const newAsc = !asc;
      setAsc(newAsc);
      fetchDoctors(pgno, column, newAsc);
    } else {
      setSorting(column);
      setAsc(true);
      fetchDoctors(pgno, column, true);
    }
  };

  const sortArrow = (column) => {
    if (sorting !== column) return "";
    return asc ? " ↑" : " ↓";
  };

  return (
    <div className="container mt-4">

      <h3 className="mb-4">Doctors (Paginated)</h3>

      {loading && <p>Loading...</p>}

      {!loading && records.length === 0 && (
        <p className="text-danger">No doctors found</p>
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

                  <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                    Name{sortArrow("name")}
                  </th>

                  <th onClick={() => handleSort("department")} style={{ cursor: "pointer" }}>
                    Department{sortArrow("department")}
                  </th>

                  <th onClick={() => handleSort("availabilitySchedule")} style={{ cursor: "pointer" }}>
                    Availability{sortArrow("availabilitySchedule")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {records.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.department}</td>
                    <td>{d.availabilitySchedule}</td>
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
              onClick={() => fetchDoctors(pgno - 1)}
            >
              Prev
            </button>

            <span className="align-self-center">
              Page {pgno + 1} of {totalPages}
            </span>

            <button
              className="btn btn-secondary"
              disabled={pgno >= totalPages - 1 || loading}
              onClick={() => fetchDoctors(pgno + 1)}
            >
              Next
            </button>

          </div>
        </>
      )}

    </div>
  );
}