import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function UpdateDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctorName, setDoctorName] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [availabilitySchedule, setAvailabilitySchedule] = useState("");
  const [originalDoctor, setOriginalDoctor] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:9002/api/doctor/get/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
    .then((res) => {
      const doc = res.data;
      setDoctorName(doc.doctor.name || "");
      setDoctorDepartment(doc.doctor.department || "");
      setAvailabilitySchedule(doc.doctor.availabilitySchedule || "");
      setOriginalDoctor(doc);
    })
    .catch(() => {
      toast.error("Doctor not found");
    });
  }, [id]);

  const updateHandler = (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    const url = "http://localhost:9002/api/doctor/update";

    const data = {
      doctor: {
        id: parseInt(id),
        name: doctorName.trim(),
        department: doctorDepartment.trim(),
        availabilitySchedule: availabilitySchedule.trim()
      }
    };

    axios.put(url, data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
    .then(() => {
      let updates = [];

      if (doctorName.trim() !== originalDoctor.name) {
        updates.push("Doctor name");
      }
      if (doctorDepartment.trim() !== originalDoctor.department) {
        updates.push("Department");
      }
      if (availabilitySchedule.trim() !== originalDoctor.availabilitySchedule) {
        updates.push("Availability");
      }

      if (updates.length === 0) {
        toast.info("No changes made");
      } else {
        const formatted = updates.length > 1
          ? updates.slice(0, -1).join(", ") + " and " + updates.slice(-1)
          : updates[0];

        toast.success(`${formatted} updated successfully`);
      }

      navigate("/doctor/display");
    })
    .catch((error) => {
      toast.error(error.response?.data || error.message);
      setLoading(false);
    });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Update Doctor</h3>
      <form onSubmit={updateHandler}>

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
            onChange={(e) => setDoctorName(e.target.value)}
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
            onChange={(e) => setDoctorDepartment(e.target.value)}
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
            onChange={(e) => setAvailabilitySchedule(e.target.value)}
            pattern="^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$"
            title="Enter time range like 08:00-20:00"
            required
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
            "Update Doctor"
          )}
        </button>
      </form>
    </div>
  );
}



