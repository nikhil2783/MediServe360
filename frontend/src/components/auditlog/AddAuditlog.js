import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export default function AddAuditlog() {
    let [action, setAction] = useState("");

    async function submitHandler() {
        let date = new Date();
        let data = {
            "auditLog": {
                "action": action,
                "timestamp": date,
                "user": {
                    "userId": 13,
                    "userName": "raghu",
                    "userRole": "Doctor",
                    "userEmail": "asfdas@gmail.com",
                    "userPhone": "1234234"
                }
            }
        };

        try {
            let res = await axios.post("http://localhost:9002/auditlog/insertauditlog", data, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            toast.success("Successfully added");
        } catch (err) {
            toast.error(err.message);
        }
    }

    return (
        <div className="container mt-4">
            <div className="mb-3">
                <label className="form-label">Action</label>
                <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Action"
                    onChange={(e) => setAction(e.target.value)}
                />
            </div>

            <button
                className="btn btn-secondary btn-sm"
                onClick={submitHandler}
                type="button"
            >
                Submit
            </button>
        </div>
    );
}
