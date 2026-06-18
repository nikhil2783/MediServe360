import {useState,useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
export default function FindAllAuditlog(){
    let [data,setData]=useState([]);
    const navigate=useNavigate();

    async function notificationget(){
        
        let url="http://localhost:9002/auditlog/fetchallauditlog"
        try{
            let res=await axios.get(url,{
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
            setData(res.data);
        }catch(err){
            toast.error(err.message);
        }
    }
    useEffect(()=>{
        notificationget();
    },[])

    return(
        <div className="container mt-4">
            
            <table className="table table-bordered table-striped mt-3">
                <thead className="table-dark">
                    <tr>
                        <th>auditId</th>
                        <th>Audit Action</th>
                        <th>User Id</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((m)=>{
                            return(
                                <tr>
                                    <td>{m.auditId}</td>
                                    <td>{m.action}</td>
                                    <td>{m.userId}</td>
                                    
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}