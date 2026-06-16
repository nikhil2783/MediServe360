import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function TopNavbar({ onMyProfile, onEditProfile }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const userName = localStorage.getItem("userName") || "User";
  const role     = localStorage.getItem("role") || "";

  const showNotification = role === "RECEPTIONIST" || role === "DOCTOR";

  const getDashboardRoute = () => {
    switch (role) {
      case "ADMIN":             return "/admindd";
      case "DOCTOR":            return "/doctordd";
      case "RECEPTIONIST":      return "/receptionistdd";
      case "NURSE":             return "/nursedd";
      case "FINANCEOFFICER":    return "/financedd";
      case "COMPLIANCE_OFFICER":return "/compilancedd";
      default:                  return "/login";
    }
  };

  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute("data-bs-theme") === "dark"
  );

  function toggleTheme() {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", next);
    setIsDark(!isDark);
  }

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <nav
      className="navbar sticky-top px-4 shadow d-flex align-items-center justify-content-between"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f3460 100%)",
        height: 64,
      }}
    >
      {}
      <Link to={getDashboardRoute()} className="text-decoration-none d-flex align-items-center gap-2">
        <div className="d-flex align-items-center justify-content-center rounded-3"
          style={{ width: 40, height: 40, background: "linear-gradient(135deg, #0ea5e9, #3b82f6)" }}>
          <i className="bi bi-hospital text-white"></i>
        </div>
        <div>
          <div className="text-white fw-bold">MediServe360</div>
          <div style={{ fontSize: 10, color: "#ccc" }}>HOSPITAL SYSTEM</div>
        </div>
      </Link>

      {}
      <div className="d-flex align-items-center gap-3">

        {}
        {showNotification && (
          <button className="btn text-white"
            style={{ background: "rgba(255,255,255,0.07)" }}
            title="Notifications"
            onClick={() => navigate("/notifications")}>
            <i className="bi bi-bell"></i>
          </button>
        )}

        <button className="btn text-white"
          style={{ background: "rgba(255,255,255,0.07)" }}
          onClick={toggleTheme}
          title="Toggle theme">
          <i className={`bi ${isDark ? "bi-sun" : "bi-moon-stars"}`}></i>
        </button>

        {}
        <div className="position-relative" ref={dropdownRef}>
          <button
            className="btn d-flex align-items-center gap-2 text-white"
            style={{ background: "rgba(255,255,255,0.07)" }}
            onClick={() => setOpen(!open)}>
            <div className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32, background: "#3b82f6", fontWeight: 700, fontSize: 14 }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <span>{userName}</span>
            <i className="bi bi-caret-down-fill" style={{ fontSize: 10 }}></i>
          </button>

          {open && (
            <ul
              className="dropdown-menu show shadow animated-dropdown"
              style={{ position: "absolute", right: 0, top: "110%", minWidth: 220, zIndex: 1000 }}>

              {}
              <li className="px-3 py-2">
                <strong>{userName}</strong><br />
                <small className="text-muted">{role}</small>
              </li>

              <li><hr className="dropdown-divider" /></li>

              {}
              <li>
                {onMyProfile ? (
                  <button className="dropdown-item" onClick={() => { setOpen(false); onMyProfile(); }}>
                    <i className="bi bi-person me-2"></i>My Profile
                  </button>
                ) : (
                  <Link className="dropdown-item" to="/profile" onClick={() => setOpen(false)}>
                    <i className="bi bi-person me-2"></i>My Profile
                  </Link>
                )}
              </li>

              {}
              <li>
                {onEditProfile ? (
                  <button className="dropdown-item" onClick={() => { setOpen(false); onEditProfile(); }}>
                    <i className="bi bi-pencil me-2"></i>Edit Profile
                  </button>
                ) : (
                  <Link className="dropdown-item" to="/editprofile" onClick={() => setOpen(false)}>
                    <i className="bi bi-pencil me-2"></i>Edit Profile
                  </Link>
                )}
              </li>

              <li><hr className="dropdown-divider" /></li>

              <li>
                <button className="dropdown-item text-danger"
                  onClick={() => { localStorage.clear(); navigate("/login"); }}>
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button>
              </li>

            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}