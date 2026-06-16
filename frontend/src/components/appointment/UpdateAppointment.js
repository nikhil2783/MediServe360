import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function UpdateAppointment() {

  const { aid } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [status, setStatus] = useState("");

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const minDate = date && date < today ? date : today;

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchAppointment();
  }, [aid]);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(
        "http://localhost:9002/api/patient/fetchAllPatients",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );
      setPatients(res.data || []);
    } catch {
      toast.error("Unable to load patients");
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(
        "http://localhost:9002/api/doctor/getAll",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );
      setDoctors(res.data || []);
    } catch {
      toast.error("Unable to load doctors");
    }
  };

  const fetchAppointment = async () => {
    try {
      const res = await axios.get(
        `http://localhost:9002/api/appointment/get/${aid}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      const appt = res.data.appointment;

      setDate(appt.date || "");
      setTime(appt.time?.slice(0, 5) || "");
      setDurationMinutes(appt.durationMinutes || 30);
      setPatientId(appt.patient?.patientId || "");
      setDoctorId(appt.doctor?.id || "");
      setStatus(appt.status || "");

    } catch {
      toast.error("Appointment not found");
    }
  };

  const validateDoctorAvailability = () => {
    const selectedDoctor = doctors.find(
      (doc) => doc.id === parseInt(doctorId)
    );

    if (!selectedDoctor) {
      toast.error("Invalid doctor selected");
      return false;
    }

    const schedule = selectedDoctor.availabilitySchedule;

    if (!schedule || !schedule.includes("-")) return true;

    const [start, end] = schedule.split("-");
    const formattedTime = time.length === 5 ? time + ":00" : time;

    if (formattedTime < start || formattedTime > end) {
      toast.error(`Doctor is available only between ${start} and ${end}`);
      return false;
    }

    return true;
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!date || !time || !durationMinutes || !patientId || !doctorId) {
      toast.warning("All fields are required");
      return;
    }

    if (durationMinutes < 5) {
      toast.error("Minimum duration is 5 minutes");
      return;
    }

    if (!validateDoctorAvailability()) return;

    setLoading(true);

    try {
      const formattedTime = time.length === 5 ? time + ":00" : time;

      const data = {
        appointment: {
          id: parseInt(aid),
          date,
          time: formattedTime,
          durationMinutes: parseInt(durationMinutes),
          status: status || "BOOKED",
          patient: { patientId: parseInt(patientId) },
          doctor: { id: parseInt(doctorId) }
        }
      };

      const res = await axios.put(
        "http://localhost:9002/api/appointment/update",
        data,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      //RESCHEDULE MESSAGE
      const appt = res.data?.appointment;

      let message;

      if (res.data?.wasRescheduled && appt) {
        const start = appt.time.slice(0, 5);

        const endTime =
          new Date(`1970-01-01T${appt.time}`).getTime() +
          appt.durationMinutes * 60000;

        const end = new Date(endTime)
          .toISOString()
          .substr(11, 5);

        message = `Appointment rescheduled to ${appt.date} from ${start} to ${end}`;
      } else {
        message = res.data?.message || "Appointment updated successfully";
      }

      toast.success(message);

      navigate("/appointment/display");

    } catch (error) {
      console.log("ERROR:", error);

      let message =
        error.response?.data?.errorMessage ||
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to update appointment";

      if (typeof message === "object") {
        message = JSON.stringify(message);
      }

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">

      <h3 className="mb-4">Update Appointment</h3>

      <form onSubmit={updateHandler}>

        {}
        <div className="mb-3">
          <label className="form-label">
            Date <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={minDate}
            required
          />
        </div>

        {}
        <div className="mb-3">
          <label className="form-label">
            Time <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        {}
        <div className="mb-3">
          <label className="form-label">
            Duration (minutes)
            <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            min="5"
            required
          />
        </div>

        {}
        <div className="mb-3">
          <label className="form-label">
            Select Patient <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
          >
            <option value="">-- Select Patient --</option>
            {patients.map((p) => (
              <option key={p.patientId} value={p.patientId}>
                {p.patientName} ({p.patientGender})
              </option>
            ))}
          </select>
        </div>

        {}
        <div className="mb-3">
          <label className="form-label">
            Select Doctor <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            required
          >
            <option value="">-- Select Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.department})
              </option>
            ))}
          </select>
        </div>

        {}
        <div className="mb-3">
          <label className="form-label">Status</label>
          <input
            className="form-control"
            value={status}
            disabled
          />
        </div>

        {}
        <button
          className="btn btn-warning w-100"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Submitting...
            </>
          ) : (
            "Update Appointment"
          )}
        </button>

      </form>
    </div>
  );
}