import { useParams,useNavigate } from "react-router";
import axios from 'axios';
import { useEffect } from "react";
import { toast } from "react-toastify";
export default function DeleteBed() {
    let { bedId } = useParams();
     let navigate = useNavigate();
    useEffect(() => {
        let url = `http://localhost:9002/api/beds/delete/${bedId}`;

        axios.delete(url,{
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token") 
                    }
                })
            .then((response) => {
                toast.success("Successfully deleted");
                  navigate("/bed/findAll");
                 
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
    }, [bedId]);

    return (
        <div>
            <h1>Delete Bed</h1>
            <span>Deleting Bed ID: {bedId}</span>
        </div>
    );
}
