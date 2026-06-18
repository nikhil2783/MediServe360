import {useState,useEffect} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Auditpage(){

    const [data,setData]=useState([]);
    const [count,setCount]=useState(0);
    const [totalPages,setTotalPages]=useState(0);

    const size=10;
    
    const nexthandler=()=>{
        if(count<(totalPages-1)){
            setCount(count+1);
        }
    }
    const prevhandler=()=>{
        if(count>0){
            setCount(count-1);
        }
    }

    async function fetchfunction(){
        let url=`http://localhost:9002/auditlog/fetchAllAuditlogsPaginated`;
        
        try{
            let res=await axios.get(url,
                {params: {
                pgno: count,
                size: size,
                sorting: "auditId",
                asc: true
            },
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
                });
            setData(res.data.content);
            setTotalPages(res.data.totalPages);
        }catch(err){
            toast.error(err.message);
        }
    }
    useEffect(()=>{
        fetchfunction();
    },[count])
    return(
        <div className="container mt-4">
            <table className="table table-bordered table-striped mt-3">
                <thead className="table-dark">
                    <tr>
                        <th>auditId</th>
                        <th>audit Action</th>
                        <th>audit timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    
                        {
                            data.map((m)=>{
                                return(
                                    <tr key={m.auditId}>
                                        <td>{m.auditId}</td>
                                        <td>{m.action}</td>
                                        <td>{m.timestamp}</td>
                                    </tr>
                                    
                                )
                            })
                        }
                   
                   
                </tbody>

            </table>
            <button onClick={prevhandler}>Prev</button>
            <span style={{margin:"0 10px"}}>Page {count+1} of {totalPages}</span>
            <button onClick={nexthandler}>Next</button>
        </div>
    )
}