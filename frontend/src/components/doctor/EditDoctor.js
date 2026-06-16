import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TopNavbar from "../common/TopNavbar";
export default function EditDoctor() {
  const navigate = useNavigate();
  const doctorEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  const headers = { Authorization: "Bearer " + token };

  const [doctorId, setDoctorId] = useState(null);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [availabilitySchedule, setAvailabilitySchedule] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch doctor by email on load
  useEffect(() => {
    if (!doctorEmail) return;
    axios
      .get(`http://localhost:9002/api/doctor/getbyemail?email=${doctorEmail}`, {
        headers,
      })
      .then((res) => {
        setDoctorId(res.data.doctor.id);
        setName(res.data.doctor.name);
        setDepartment(res.data.doctor.department);
        setAvailabilitySchedule(res.data.doctor.availabilitySchedule);
        setEmail(res.data.doctor.email);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch doctor details.");
        setLoading(false);
      });
  }, [doctorEmail]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const data = {
      doctor: {
        id: doctorId,
        name: name.trim(),
        department: department.trim(),
        availabilitySchedule: availabilitySchedule.trim(),
        email: email.trim(),
      },
    };

    axios
      .put("http://localhost:9002/api/doctor/update", data, { headers })
      .then(() => {
        setSuccess("Doctor details updated successfully!");
        setTimeout(() => navigate("/doctordd"), 1500);
      })
      .catch((err) => {
        setError(err.response?.data || "Failed to update. Please try again.");
      })
      .finally(() => setSaving(false));
  };

  if (loading)
    return (
      <>
        <TopNavbar />
        <div
          className="min-vh-100 d-flex align-items-center justify-content-center"
          style={{
            background:
              "linear-gradient(135deg, #e8f4f8 0%, #d6eaf8 50%, #eaf4fb 100%)",
          }}
        >
          <div className="text-center">
            <div className="spinner-border" style={{ color: "#1a73a7" }}></div>
            <p className="mt-3" style={{ color: "#1a3c5e" }}>
              Loading doctor details...
            </p>
          </div>
        </div>
      </>
    );

  return (
    <div
      className="min-vh-100"
      style={{
        background:
          "linear-gradient(135deg, #e8f4f8 0%, #d6eaf8 50%, #eaf4fb 100%)",
      }}
    >
      <TopNavbar />

      <div className="d-flex align-items-center justify-content-center py-5 px-3">
        <div
          className="card border-0 shadow-lg"
          style={{ width: "100%", maxWidth: 480, borderRadius: "16px" }}
        >
          <div className="card-body p-4 p-md-5">
            {}
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{ width: 64, height: 64, background: "#1a73a7" }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect
                    x="12"
                    y="4"
                    width="8"
                    height="24"
                    rx="2"
                    fill="white"
                  />
                  <rect
                    x="4"
                    y="12"
                    width="24"
                    height="8"
                    rx="2"
                    fill="white"
                  />
                </svg>
              </div>
              <h5 className="fw-bold mb-1" style={{ color: "#1a3c5e" }}>
                Edit Doctor Profile
              </h5>
              <p className="small mb-0" style={{ color: "#5a8fa8" }}>
                Update your details below
              </p>
            </div>

            {}
            <div className="d-flex align-items-center gap-2 mb-4">
              <hr
                className="flex-grow-1 m-0"
                style={{ borderColor: "#c8dfe9" }}
              />
              <span
                className="small px-2 py-1 rounded-pill fw-semibold"
                style={{
                  background: "#e3f2fb",
                  color: "#1a73a7",
                  fontSize: "0.7rem",
                  letterSpacing: "0.06em",
                }}
              >
                DOCTOR ID: {doctorId}
              </span>
              <hr
                className="flex-grow-1 m-0"
                style={{ borderColor: "#c8dfe9" }}
              />
            </div>

            {}
            {error && (
              <div className="alert alert-danger py-2 small" role="alert">
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success py-2 small" role="alert">
                ✅ {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {}
              <div className="mb-3">
                <label
                  className="form-label small fw-semibold"
                  style={{ color: "#1a3c5e" }}
                >
                  Doctor Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  pattern="[A-Za-z\s]+"
                  title="Only letters allowed"
                  style={{ borderColor: "#b0cfe0", borderRadius: "8px" }}
                  required
                />
              </div>

              {}
              <div className="mb-3">
                <label
                  className="form-label small fw-semibold"
                  style={{ color: "#1a3c5e" }}
                >
                  Department <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  className="form-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{ borderColor: "#b0cfe0", borderRadius: "8px" }}
                  required
                >
                  <option value="">-- Choose a Department --</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                  <option value="orthopedics">Orthopedics</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="oncology">Oncology</option>
                  <option value="radiology">Radiology</option>
                  <option value="emergency">Emergency Medicine</option>
                  <option value="gynecology">Gynecology & Obstetrics</option>
                  <option value="gastro">Gastroenterology</option>
                  <option value="pulmonology">Pulmonology</option>
                  <option value="nephrology">Nephrology</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="psychiatry">Psychiatry</option>
                  <option value="ent">ENT - Ear, Nose & Throat</option>
                  <option value="urology">Urology</option>
                </select>
              </div>

              {}
              <div className="mb-3">
                <label
                  className="form-label small fw-semibold"
                  style={{ color: "#1a3c5e" }}
                >
                  Email Address <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderColor: "#b0cfe0", borderRadius: "8px" }}
                  required
                />
              </div>

              {}
              <div className="mb-4">
                <label
                  className="form-label small fw-semibold"
                  style={{ color: "#1a3c5e" }}
                >
                  Availability (HH:mm-HH:mm){" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={availabilitySchedule}
                  onChange={(e) => setAvailabilitySchedule(e.target.value)}
                  placeholder="08:00-20:00"
                  pattern="^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$"
                  title="Enter time range like 08:00-20:00"
                  style={{ borderColor: "#b0cfe0", borderRadius: "8px" }}
                  required
                />
              </div>

              {}
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn w-50 fw-semibold"
                  onClick={() => navigate("/doctordd")}
                  style={{
                    background: "#f0f4f8",
                    color: "#1a3c5e",
                    borderRadius: "8px",
                    border: "none",
                    padding: "0.6rem",
                  }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="btn w-50 fw-semibold text-white"
                  disabled={saving}
                  style={{
                    background: "#1a73a7",
                    borderRadius: "8px",
                    border: "none",
                    padding: "0.6rem",
                  }}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : (
                    "💾 Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
