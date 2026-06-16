import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TopNavbar from "../common/TopNavbar";

export default function UpdateUser() {

    const id = localStorage.getItem("userId");
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUser();
    }, [id]);

    async function fetchUser() {
        const url = `http://localhost:9002/user/findbyid/${id}`;
        try {
            const res = await axios.get(url, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            });
            setName(res.data.userName);
            setRole(res.data.role);
            setPhone(res.data.phoneNumber);
            setPassword("");
        } catch (err) {
            toast.error(err.message);
        }
    }

    async function submitHandler(e) {
        e.preventDefault();

        if (!name || !role || !phone) {
            toast.warning("Please fill all required fields");
            return;
        }

        const data = {
            userName: name,
            userRole: role,
            phonenumber: phone,
            password: password
        };

        setLoading(true);
        try {
            await axios.put(
                `http://localhost:9002/user/updateuser/${id}`,
                data,
                { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
            );
            toast.success("Profile updated successfully");
            navigate(-1);
        } catch (err) {
            toast.error(err.response?.data?.errorMessage || err.message);
        } finally {
            setLoading(false);
        }
    }

    const initials = name
        ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
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
                            {name || "Your Name"}
                        </h4>
                        <span
                            className="badge mt-1"
                            style={{ background: "#3b82f6", fontSize: "0.75rem", letterSpacing: "0.05em" }}
                        >
                            {role}
                        </span>
                    </div>
                </div>

                {}
                <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: "14px" }}>
                    <div className="card-body p-4">

                        <h6 className="fw-bold text-muted text-uppercase mb-4" style={{ fontSize: "0.75rem", letterSpacing: "0.08em" }}>
                            Edit Information
                        </h6>

                        <form onSubmit={submitHandler}>

                            {}
                            <div className="mb-3">
                                <label className="form-label small fw-semibold" style={{ color: "#64748b" }}>
                                    <i className="bi bi-hash me-1"></i>User ID
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={id}
                                    disabled
                                    style={{ backgroundColor: "#f1f5f9", borderRadius: "8px", border: "1px solid #e2e8f0", color: "#94a3b8" }}
                                />
                            </div>

                            {}
                            <div className="mb-3">
                                <label className="form-label small fw-semibold" style={{ color: "#334155" }}>
                                    <i className="bi bi-person me-1"></i>Full Name
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={name}
                                    placeholder="Enter your full name"
                                    onChange={(e) => setName(e.target.value)}
                                    style={{ borderRadius: "8px", borderColor: "#cbd5e1" }}
                                />
                            </div>

                            {}
                            <div className="mb-3">
                                <label className="form-label small fw-semibold" style={{ color: "#334155" }}>
                                    <i className="bi bi-shield me-1"></i>Role
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={role}
                                    disabled
                                    style={{ backgroundColor: "#f1f5f9", borderRadius: "8px", border: "1px solid #e2e8f0", color: "#94a3b8" }}
                                />
                            </div>

                            {}
                            <div className="mb-3">
                                <label className="form-label small fw-semibold" style={{ color: "#334155" }}>
                                    <i className="bi bi-telephone me-1"></i>Phone Number
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={phone}
                                    placeholder="Enter your phone number"
                                    onChange={(e) => setPhone(e.target.value)}
                                    style={{ borderRadius: "8px", borderColor: "#cbd5e1" }}
                                />
                            </div>

                            {}
                            <div className="mb-4">
                                <label className="form-label small fw-semibold" style={{ color: "#334155" }}>
                                    <i className="bi bi-lock me-1"></i>New Password
                                </label>
                                <input
                                    className="form-control"
                                    type="password"
                                    value={password}
                                    placeholder="Leave blank to keep current password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ borderRadius: "8px", borderColor: "#cbd5e1" }}
                                />
                                <div className="form-text" style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                                    Only fill this if you want to change your password.
                                </div>
                            </div>

                            {}
                            <div className="d-flex gap-2">
                                <button
                                    type="submit"
                                    className="btn fw-semibold px-4"
                                    disabled={loading}
                                    style={{ background: "#3b82f6", color: "#fff", borderRadius: "8px" }}
                                >
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                                    ) : (
                                        <><i className="bi bi-check-lg me-2"></i>Save Changes</>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="btn fw-semibold px-4"
                                    style={{ background: "#f1f5f9", color: "#334155", borderRadius: "8px" }}
                                    onClick={() => navigate(-1)}
                                >
                                    <i className="bi bi-x-lg me-2"></i>Cancel
                                </button>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}