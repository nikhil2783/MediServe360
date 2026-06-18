import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function FindAppointment() {

  const [id, setId] = useState("");
  const [searched, setSearched] = useState(false);
  const [appointment, setAppointment] = useState({});

  const idHandler = (event) => {
    setId(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!id) {
      toast.warning("Please enter appointment ID");
      return;
    }

    const url = `http://localhost:9002/api/appointment/get/${id}`;

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      setAppointment(res.data.appointment || {});

    } catch (err) {
      if (err.response && err.response.status === 404) {
        setAppointment({});
      } else {
        console.error(err.message);
        toast.error("Something went wrong");
      }
    }

    setSearched(true);
  };

  return (
    <div className="container mt-4">

      <h3 className="mb-4">Find Appointment by ID</h3>

      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label className="form-label">Enter Appointment ID</label>
          <input
            className="form-control"
            type="number"
            value={id}
            onChange={idHandler}
            placeholder="Enter appointment ID"
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
      {searched && !appointment.id && (
        <p className="mt-3 text-danger">No records found</p>
      )}

      {}
      {appointment.id && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped mt-4">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Patient</th>
                <th>Doctor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{appointment.id}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.status}</td>
                <td>{appointment.durationMinutes} mins</td>

                {}
                <td>
                  {appointment.patient?.patientName} <br />
                  <small>
                    {appointment.patient?.patientGender} | ID: {appointment.patient?.patientId}
                  </small>
                </td>

                {}
                <td>
                  {appointment.doctor?.name} <br />
                  <small>
                    {appointment.doctor?.department} | ID: {appointment.doctor?.id}
                  </small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
