import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
export default function UpdateBed() {

    let { bedId } = useParams();
    let navigate = useNavigate();

    let [bedStatus, setBedStatus] = useState("");
    let [wardId, setWardId] = useState("");

    let bedStatusHandler = (e) => {
        setBedStatus(e.target.value);
    }

    let wardIdHandler = (e) => {
        setWardId(e.target.value);
    }

    useEffect(() => {
        let url = `http://localhost:9002/api/beds/getBed/${bedId}`;
        axios.get(url,{
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token") 
                    }
                })
            .then((res) => {
                setBedStatus(res.data.bed.bedStatus);
                setWardId(res.data.bed.ward?.wardId || "");
            })
            .catch((err) => {
                toast.error(err);
            });
    }, []);

    let updateButtonHandler = () => {
        let url = "http://localhost:9002/api/beds/updateBed";
        let data = {
            "bed": {
                "bedId": parseInt(bedId),
                "bedStatus": bedStatus,
                ...(wardId && { "ward": { "wardId": parseInt(wardId) } })
            }
        };
        axios.put(url, data,{
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token") 
                    }
                })
            .then((res) => {
                toast.success("Bed updated successfully");
                navigate("/bed/FindAll");
            })
            .catch((error) => {
                if (error.response) {
                    toast.error("Error " + error.response.status + ": " + (error.response.data?.errorMessage || JSON.stringify(error.response.data)));
                } else if (error.request) {
                    toast.error("No response from server. Make sure the backend is running on port 9002.");
                } else {
                    toast.error("Error: " + error.message);
                }
            });
    }

    return (
        <div className="container mt-4">
            <h2>Update Bed {bedId}</h2>

            <div className="mb-3">
                <label className="form-label">Bed ID</label>
                <input className="form-control" value={bedId} readOnly />
            </div>

            <div className="mb-3">
                <label className="form-label">Bed Status</label>
                <input className="form-control" value={bedStatus} onChange={bedStatusHandler} />
            </div>

            <div className="mb-3">
                <label className="form-label">Ward ID</label>
                <input className="form-control" value={wardId} onChange={wardIdHandler} />
            </div>

            <button className="btn btn-warning" onClick={updateButtonHandler}>Update</button>
        </div>
    );
}
