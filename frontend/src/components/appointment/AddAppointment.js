import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AddAppointment() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(
        "http://localhost:9002/api/patient/fetchAllPatients",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );
      setPatients(res.data || []);
    } catch {
      toast.error("Unable to load patients. Please try again.");
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:9002/api/doctor/getAll", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setDoctors(res.data || []);
    } catch {
      toast.error("Unable to load doctors. Please try again.");
    }
  };

  const validateDoctorAvailability = () => {
    const selectedDoctor = doctors.find((doc) => doc.id === parseInt(doctorId));

    if (!selectedDoctor) {
      toast.error("Invalid doctor selection");
      return false;
    }

    const schedule = selectedDoctor.availabilitySchedule;

    if (!schedule || !schedule.includes("-")) {
      toast.error("Doctor availability not configured");
      return false;
    }

    const [start, end] = schedule.split("-");
    const formattedTime = time.length === 5 ? time + ":00" : time;

    if (formattedTime < start || formattedTime > end) {
      toast.error(`Doctor is available only between ${start} and ${end}`);
      return false;
    }

    return true;
  };

  const handlePatientChange = (e) => {
    setPatientId(e.target.value);
  };

  const handleDoctorChange = (e) => {
    setDoctorId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!date || !time || !durationMinutes || !patientId || !doctorId) {
      toast.warning("All fields are required");
      return;
    }

    if (durationMinutes < 5) {
      toast.error("Minimum appointment duration is 5 minutes");
      return;
    }

    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);

    if (selectedDateTime < now) {
      toast.error("Cannot book appointment in past time");
      return;
    }

    if (!validateDoctorAvailability()) return;

    setLoading(true);
    try {
      const formattedTime = time.length === 5 ? time + ":00" : time;

      const data = {
        appointment: {
          date: date,
          time: formattedTime,
          durationMinutes: parseInt(durationMinutes),
          status: "BOOKED",
          patientId: parseInt(patientId),
          doctorId: parseInt(doctorId),
        },
      };

      const res = await axios.post(
        "http://localhost:9002/api/appointment/add",
        data,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );

      const message = res.data?.message || "Appointment created successfully";
      toast.success(message);

      setDate("");
      setTime("");
      setDurationMinutes(30);
      setPatientId("");
      setDoctorId("");
    } catch (error) {
      let message =
        error.response?.data?.errorMessage ||
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to create appointment";

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
      <h3 className="mb-4">Book an Appointment</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            Date <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

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

        <div className="mb-3">
          <label className="form-label">
            Duration (minutes) <span className="text-danger">*</span>
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

        <div className="mb-3">
          <label className="form-label">
            Select Patient <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            value={patientId}
            onChange={handlePatientChange}
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

        <div className="mb-3">
          <label className="form-label">
            Select Doctor <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            value={doctorId}
            onChange={handleDoctorChange}
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

        <button
          className="btn btn-primary w-100"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Submitting...
            </>
          ) : (
            "Add Appointment"
          )}
        </button>
      </form>
    </div>
  );
}
