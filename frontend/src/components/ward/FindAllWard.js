import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
export default function FindAllWard() {

    let [wardArr, setWardArr] = useState([]);

    useEffect(() => {
        let url = "http://localhost:9002/api/ward/getAllWards";
        axios.get(url,{
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token") 
                    }
                })
            .then((response) => {
                setWardArr(response.data);
            })
            .catch((error) => {
                toast.error(error.message);
            });
    }, []);

    return (
        <div className="container mt-4">
            <h2>All Wards</h2>

            <table className="table table-bordered table-striped mt-3">
                <thead className="table-dark">
                    <tr>
                        <th>Ward ID</th>
                        <th>Ward Name</th>
                        <th>Ward Capacity</th>
                        <th>Ward Status</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        wardArr.map((ward) => {
                            return (
                                <tr key={ward.wardId}>
                                    <td>{ward.wardId}</td>
                                    <td>{ward.wardname}</td>
                                    <td>{ward.wardcapacity}</td>
                                    <td>{ward.wardstatus}</td>
                                    <td>
                                        <Link className="btn btn-warning btn-sm" to={"/ward/update/" + ward.wardId}>Update</Link>
                                    </td>
                                    <td>
                                        <Link className="btn btn-danger btn-sm" to={"/ward/delete/" + ward.wardId}>Delete</Link>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}
