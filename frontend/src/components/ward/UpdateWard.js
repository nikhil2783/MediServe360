import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
export default function UpdateWard() {

    let { wardId } = useParams();
    let navigate = useNavigate();

    let [wardName, setWardName] = useState("");
    let [wardCapacity, setWardCapacity] = useState("");
    let [wardStatus, setWardStatus] = useState("");

    let wardNameHandler = (e) => {
        setWardName(e.target.value);
    }

    let wardCapacityHandler = (e) => {
        setWardCapacity(e.target.value);
    }

    let wardStatusHandler = (e) => {
        setWardStatus(e.target.value);
    }

    useEffect(() => {
        let url = `http://localhost:9002/api/ward/getWard/${wardId}`;
        axios.get(url,{
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token") 
                    }
                })
            .then((res) => {
                setWardName(res.data.ward.wardname);
                setWardCapacity(res.data.ward.wardcapacity);
                setWardStatus(res.data.ward.wardstatus);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    }, []);

    let updateButtonHandler = () => {
    let url = "http://localhost:9002/api/ward/updateWard";  
    let data = {
        "ward": {
            "wardId": parseInt(wardId),
            "wardname": wardName,
            "wardcapacity": parseInt(wardCapacity),
            "wardstatus": wardStatus
        }
    };

    axios.put(url, data, {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")  
        }
    })
    .then((res) => {
        toast.success("Ward updated successfully");
        navigate("/ward/findAll");
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
            <h2>Update Ward {wardId}</h2>

            <div className="mb-3">
                <label className="form-label">Ward ID</label>
                <input className="form-control" value={wardId} readOnly />
            </div>

            <div className="mb-3">
                <label className="form-label">Ward Name</label>
                <input className="form-control" value={wardName} onChange={wardNameHandler} />
            </div>

            <div className="mb-3">
                <label className="form-label">Ward Capacity</label>
                <input className="form-control" value={wardCapacity} onChange={wardCapacityHandler} />
            </div>

            <div className="mb-3">
                <label className="form-label">Ward Status</label>
                <input className="form-control" value={wardStatus} onChange={wardStatusHandler} />
            </div>

            <button className="btn btn-warning" onClick={updateButtonHandler}>Update</button>
        </div>
    );
}
