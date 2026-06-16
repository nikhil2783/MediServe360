import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const login = (event) => {
        event.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);

        axios.post("http://localhost:9002/api/auth/login", { email, password })
            .then((res) => {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("role", res.data.role);
                localStorage.setItem("userName", res.data.userName);
                localStorage.setItem("userId", res.data.userId);
                localStorage.setItem("email", res.data.email);

                const role = res.data.role;
                if (role === "ADMIN")                   navigate("/admindd");
                else if (role === "NURSE")              navigate("/nursedd");
                else if (role === "RECEPTIONIST")       navigate("/receptionistdd");
                else if (role === "DOCTOR")             navigate("/doctordd");
                else if (role === "FINANCEOFFICER")     navigate("/financedd");
                else if (role === "COMPLIANCE_OFFICER") navigate("/compilancedd");
            })
            .catch((err) => {
                // ✅ Fixed: read message from err.response.data.message
                const msg = err.response?.data?.message || "";

                if (msg.toLowerCase().includes("pending")) {
                    setError("Your account is pending admin approval.");
                } else if (msg.toLowerCase().includes("reject") || msg.toLowerCase().includes("not approved")) {
                    setError("Your account has been rejected by admin.");
                } else if (msg.toLowerCase().includes("password invalid")) {
                    setError("Invalid email or password. Please try again.");
                }  else if (msg.toLowerCase().includes("invalid email")) {
                    setError("Invalid email. Please try again.");
                }else {
                    setError(msg || "Something went wrong. Please try again.");
                }
                setLoading(false);
            });
    };

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center px-3"
            style={{ background: "#0f2d3d" }}
        >
            <div
                className="card border-0 shadow-lg overflow-hidden"
                style={{ width: "100%", maxWidth: 780, borderRadius: "18px", minHeight: "420px" }}
            >
                <div className="row g-0 h-100">

                    <div
                        className="col-md-5 d-none d-md-flex flex-column align-items-center justify-content-center p-4 text-white text-center"
                        style={{ background: "linear-gradient(160deg, #1a73a7 0%, #0d4f73 100%)" }}
                    >
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center mb-4"
                            style={{ width: 88, height: 88, background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)" }}
                        >
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <rect x="15" y="5" width="10" height="30" rx="3" fill="white"/>
                                <rect x="5" y="15" width="30" height="10" rx="3" fill="white"/>
                            </svg>
                        </div>
                        <h4 className="fw-bold mb-2">MediServe</h4>
                        <p className="small mb-4" style={{ opacity: 0.8, lineHeight: 1.6 }}>
                            Integrated Hospital Management System
                        </p>
                        <div className="d-flex flex-column gap-2 w-100 px-2">
                            {["Patient Care", "Staff Management", "Finance & Billing"].map((item) => (
                                <div
                                    key={item}
                                    className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                                    style={{ background: "rgba(255,255,255,0.1)", fontSize: "0.8rem" }}
                                >
                                    <span style={{ color: "#7dd3f7" }}>✦</span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-md-7 d-flex align-items-center bg-white">
                        <div className="w-100 p-4 p-md-5">

                            <div className="d-flex d-md-none align-items-center gap-2 mb-4">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: 36, height: 36, background: "#1a73a7" }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                                        <rect x="12" y="4" width="8" height="24" rx="2" fill="white"/>
                                        <rect x="4" y="12" width="24" height="8" rx="2" fill="white"/>
                                    </svg>
                                </div>
                                <span className="fw-bold" style={{ color: "#1a3c5e" }}>MediServe</span>
                            </div>

                            <h5 className="fw-bold mb-1" style={{ color: "#1a3c5e" }}>Welcome back</h5>
                            <p className="small mb-4" style={{ color: "#5a8fa8" }}>Sign in to your hospital account</p>

                            {error && (
                                <div className="alert alert-danger py-2 small" role="alert">
                                    ⚠️ {error}
                                </div>
                            )}

                            <form onSubmit={login}>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold" style={{ color: "#1a3c5e" }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="jane@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ borderColor: "#b0cfe0", borderRadius: "8px" }}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-semibold" style={{ color: "#1a3c5e" }}>
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ borderColor: "#b0cfe0", borderRadius: "8px" }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn w-100 fw-semibold text-white"
                                    disabled={loading}
                                    style={{ background: "#1a73a7", borderRadius: "8px", border: "none", padding: "0.6rem" }}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Signing in...
                                        </>
                                    ) : "Sign In →"}
                                </button>
                            </form>

                            <hr className="my-4" style={{ borderColor: "#c8dfe9" }} />

                            <p className="text-center small mb-0" style={{ color: "#5a8fa8" }}>
                                Don't have an account?{" "}
                                <Link to="/register" className="fw-semibold text-decoration-none" style={{ color: "#1a73a7" }}>
                                    Register
                                </Link>
                            </p>
                            <p className="text-center small mb-0" style={{ color: "#5a8fa8" }}>
                                Forgot password?{" "}
                                <Link to="/updatepass" className="fw-semibold text-decoration-none" style={{ color: "#1a73a7" }}>
                                    Change
                                </Link>
                            </p>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}