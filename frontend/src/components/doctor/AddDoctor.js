import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AddDoctor() {

  const [doctorName, setDoctorName] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [availabilitySchedule, setAvailabilitySchedule] = useState("");
  const [loading, setLoading] = useState(false);

  const doctorNameHandler = (event) => {
    setDoctorName(event.target.value);
  };

  const doctorDepartmentHandler = (event) => {
    setDoctorDepartment(event.target.value);
  };

  const availabilityHandler = (event) => {
    setAvailabilitySchedule(event.target.value);
  };

  const buttonHandler = () => {
    if (loading) return;

    setLoading(true);

    const url = "http://localhost:9002/api/doctor/add";

    const data = {
      doctor: {
        name: doctorName.trim(),
        department: doctorDepartment.trim(),
        availabilitySchedule: availabilitySchedule.trim()
      }
    };

    axios.post(url, data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
    .then(() => {
      toast.success("Doctor Added successfully");

      setDoctorName("");
      setDoctorDepartment("");
      setAvailabilitySchedule("");

      setLoading(false);
    })
    .catch((error) => {
      toast.error(error.response?.data || error.message);
      setLoading(false);
    });
  };

  return (
    <div className="container mt-4">

      <h3 className="mb-4">Add Doctor</h3>

      <form onSubmit={(e) => {
        e.preventDefault();
        buttonHandler();
      }}>

        {}
        <div className="mb-3">
          <label className="form-label">
            Doctor Name <span style={{ color: "red" }}> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            value={doctorName}
            placeholder="Enter doctor name"
            onChange={doctorNameHandler}
            pattern="[A-Za-z\s]+"
            title="Only letters allowed"
            required
          />
        </div>

        {}
        <div className="mb-3">
          <label className="form-label">
            Department <span style={{ color: "red" }}> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            value={doctorDepartment}
            placeholder="Enter department"
            onChange={doctorDepartmentHandler}
            pattern="[A-Za-z\s]+"
            title="Only letters allowed"
            required
          />
        </div>

        {}
        <div className="mb-3">
          <label className="form-label">
            Availability (HH:mm-HH:mm) <span style={{ color: "red" }}> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            value={availabilitySchedule}
            placeholder="08:00-20:00"
            onChange={availabilityHandler}
            pattern="^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$"
            title="Enter time range like 08:00-20:00"
            required
          />
        </div>

        {}
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
            "Add Doctor"
          )}
        </button>

      </form>
    </div>
  );
}