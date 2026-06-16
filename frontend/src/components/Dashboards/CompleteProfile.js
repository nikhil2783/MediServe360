import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE = "http://localhost:9002";

const DEPARTMENTS = [
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "Gynecology",
  "General Medicine",
  "Dermatology",
  "Pediatrics",
  "ENT",
  "Urology",
  "Psychiatry",
  "Oncology",
  "Radiology",
  "Anesthesiology",
  "Emergency Medicine",
  "Other",
];

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    department: "",
    availabilitySchedule: "",
    customStart: "09:00",
    customEnd: "17:00",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const headers = { Authorization: "Bearer " + token };

  const availability = `${form.customStart}-${form.customEnd}`;

  function handleSubmit() {
    if (!form.department) {
      setError("Please select your department.");
      return;
    }
    if (!form.customStart || !form.customEnd) {
      setError("Please set your availability hours.");
      return;
    }
    if (form.customStart >= form.customEnd) {
      setError("End time must be after start time.");
      return;
    }

    setSaving(true);
    setError("");

    //get doctor by email
    axios
      .get(`${BASE}/api/doctor/by-email?email=${encodeURIComponent(email)}`, {
        headers,
      })
      .then((res) => {
        const doctor = res.data.doctor;

        //update doctor profile
        return axios.put(
          `${BASE}/api/doctor/update`,
          {
            doctor: {
              ...doctor,
              department: form.department,
              availabilitySchedule: availability,
            },
          },
          { headers },
        );
      })
      .then(() => {
        navigate("/doctordd");
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Failed to save profile. Please try again.",
        );
        setSaving(false);
      });
  }

  return (
    <div className="min-vh-100 bg-body-tertiary d-flex align-items-center justify-content-center px-3">
      <div
        className="card border-0 shadow-lg w-100"
        style={{ maxWidth: 520, borderRadius: 20 }}
      >
        {}
        <div className="card-body p-5">
          {}
          <div className="d-flex align-items-center gap-2 mb-4">
            <div
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #0ea5e9, #3b82f6)",
              }}
            >
              <i className="bi bi-hospital text-white"></i>
            </div>
            <div>
              <div className="fw-bold" style={{ fontSize: 15 }}>
                MediServe360
              </div>
              <div
                className="text-muted"
                style={{ fontSize: 10, letterSpacing: 1 }}
              >
                HOSPITAL SYSTEM
              </div>
            </div>
          </div>

          {}
          <h5 className="fw-bold mb-1">Complete Your Profile</h5>
          <p className="text-muted mb-4" style={{ fontSize: 14 }}>
            Welcome! Please fill in your department and availability to get
            started.
          </p>

          {}
          <div className="d-flex align-items-center gap-2 mb-4">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle bg-success text-white"
              style={{ width: 28, height: 28, fontSize: 12, fontWeight: 700 }}
            >
              <i className="bi bi-check"></i>
            </div>
            <div
              className="flex-grow-1"
              style={{ height: 2, background: "#3b82f6", borderRadius: 2 }}
            ></div>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
              style={{ width: 28, height: 28, fontSize: 12, fontWeight: 700 }}
            >
              2
            </div>
            <div
              className="flex-grow-1"
              style={{ height: 2, background: "#e2e8f0", borderRadius: 2 }}
            ></div>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle bg-body-secondary text-muted"
              style={{ width: 28, height: 28, fontSize: 12, fontWeight: 700 }}
            >
              3
            </div>
          </div>
          <div className="d-flex justify-content-between mb-4">
            <small className="text-success fw-semibold">Account Created</small>
            <small className="text-primary fw-semibold">Profile Setup</small>
            <small className="text-muted">Dashboard</small>
          </div>

          {error && (
            <div
              className="alert alert-danger py-2 mb-3"
              style={{ fontSize: 13 }}
            >
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {}
          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
              <i className="bi bi-building me-2 text-primary"></i>
              Department <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={form.department}
              onChange={(e) =>
                setForm((p) => ({ ...p, department: e.target.value }))
              }
            >
              <option value="">Select your department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {}
          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
              <i className="bi bi-clock me-2 text-primary"></i>
              Working Hours <span className="text-danger">*</span>
            </label>
            <div className="row g-2">
              <div className="col-6">
                <label
                  className="form-label text-muted"
                  style={{ fontSize: 12 }}
                >
                  Start Time
                </label>
                <input
                  type="time"
                  className="form-control"
                  value={form.customStart}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, customStart: e.target.value }))
                  }
                />
              </div>
              <div className="col-6">
                <label
                  className="form-label text-muted"
                  style={{ fontSize: 12 }}
                >
                  End Time
                </label>
                <input
                  type="time"
                  className="form-control"
                  value={form.customEnd}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, customEnd: e.target.value }))
                  }
                />
              </div>
            </div>
            {form.customStart &&
              form.customEnd &&
              form.customStart < form.customEnd && (
                <small className="text-success mt-1 d-block">
                  <i className="bi bi-check-circle me-1"></i>
                  Availability: {form.customStart} – {form.customEnd}
                </small>
              )}
          </div>

          {}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="btn btn-primary w-100 py-2 fw-semibold"
            style={{ borderRadius: 10 }}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-right-circle me-2"></i>Complete Setup
                & Go to Dashboard
              </>
            )}
          </button>

          <p
            className="text-center text-muted mt-3 mb-0"
            style={{ fontSize: 12 }}
          >
            You can update these details anytime from your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
}
