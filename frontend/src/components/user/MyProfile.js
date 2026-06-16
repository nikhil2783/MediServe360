import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TopNavbar from "../common/TopNavbar";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:9002/user/myProfile", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => toast.error(err.response?.data || err.message));
  }, []);

  if (!user)
    return (
      <div className="min-vh-100 bg-light">
        <TopNavbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
          <div className="spinner-border text-primary" role="status" />
        </div>
      </div>
    );

  const initials = user.userName
    ? user.userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f0f2f5" }}>
      <TopNavbar />

      {}
      <div
        style={{
          height: "180px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f3460 100%)",
        }}
      />

      <div className="container" style={{ maxWidth: 720, marginTop: "-70px" }}>

        {}
        <div className="d-flex align-items-end gap-4 mb-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow"
            style={{
              width: 110,
              height: 110,
              fontSize: "2.2rem",
              background: "linear-gradient(135deg, #0ea5e9, #3b82f6)",
              border: "4px solid #fff",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div className="pb-2">
            <h4 className="fw-bold mb-0 text-white" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
              {user.userName}
            </h4>
            <span
              className="badge mt-1"
              style={{ background: "#3b82f6", fontSize: "0.75rem", letterSpacing: "0.05em" }}
            >
              {user.role}
            </span>
          </div>
        </div>

        {}
        <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: "14px" }}>
          <div className="card-body p-4">
            <h6 className="fw-bold text-muted text-uppercase mb-3" style={{ fontSize: "0.75rem", letterSpacing: "0.08em" }}>
              Personal Information
            </h6>

            <div className="row g-3">

              <div className="col-12 col-md-6">
                <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: "#f8fafc" }}>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 40, height: 40, background: "#dbeafe", flexShrink: 0 }}
                  >
                    <i className="bi bi-person-fill text-primary"></i>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Full Name</div>
                    <div className="fw-semibold" style={{ fontSize: "0.95rem" }}>{user.userName}</div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: "#f8fafc" }}>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 40, height: 40, background: "#dcfce7", flexShrink: 0 }}
                  >
                    <i className="bi bi-envelope-fill text-success"></i>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Email</div>
                    <div className="fw-semibold" style={{ fontSize: "0.95rem" }}>{user.email}</div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: "#f8fafc" }}>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 40, height: 40, background: "#fef9c3", flexShrink: 0 }}
                  >
                    <i className="bi bi-telephone-fill text-warning"></i>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Phone</div>
                    <div className="fw-semibold" style={{ fontSize: "0.95rem" }}>{user.phoneNumber}</div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: "#f8fafc" }}>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 40, height: 40, background: "#ede9fe", flexShrink: 0 }}
                  >
                    <i className="bi bi-shield-fill text-purple" style={{ color: "#7c3aed" }}></i>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Role</div>
                    <div className="fw-semibold" style={{ fontSize: "0.95rem" }}>{user.role}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {}
        <div className="d-flex gap-2 mb-5">
          <button
            className="btn fw-semibold px-4"
            style={{ background: "#3b82f6", color: "#fff", borderRadius: "8px" }}
            onClick={() => navigate("/editprofile")}
          >
            <i className="bi bi-pencil me-2"></i>Edit Profile
          </button>
          <button
            className="btn fw-semibold px-4"
            style={{ background: "#f1f5f9", color: "#334155", borderRadius: "8px" }}
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2"></i>Back
          </button>
        </div>

      </div>
    </div>
  );
}