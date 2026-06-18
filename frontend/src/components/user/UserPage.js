import {useState,useEffect} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function UserPage(){

    const [data,setData]=useState([]);
    const [count,setCount]=useState(0);
    const [totalPages,setTotalPages]=useState(0);

    const size=6;
    
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

    async function fetchfunction() {
    let url = `http://localhost:9002/user/fetchAllUsersPaginated`;
    
    try {
        let res = await axios.get(url, {
            params: {
                pgno: count,
                size: size,
                sorting: "userId",
                asc: true
            },
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        });
        
        setData(res.data.content);
        setTotalPages(res.data.totalPages);
    } catch (err) {
        toast.error(err.message);
    }
}
    useEffect(()=>{
        fetchfunction();
    },[count])
    return(
        <div className="container mt-4 table-responsive">
            <table className="table table-bordered table-striped mt-3">
                <thead className="table-dark">
                    <tr>
                        <th>userId</th>
                        <th>user Name</th>
                        <th>user Role</th>
                        <th>User Email</th>
                        <th>User Phone</th>
                    </tr>
                </thead>
                <tbody>
                    
                        {
                            data.map((m)=>{
                                return(
                                    <tr>
                                        <td>{m.userId}</td>
                                        <td>{m.userName}</td>
                                        <td>{m.userRole}</td>
                                        <td>{m.userEmail}</td>
                                        <td>{m.userPhone}</td>
                                    </tr>
                                    
                                )
                            })
                        }
                   
                   
                </tbody>

            </table>
            <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={prevhandler}
                    disabled={count === 0}
                >
                    ← Prev
                </button>

                <span className="fw-semibold">
                    Page {count + 1} of {totalPages}
                </span>

                <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={nexthandler}
                    disabled={count === totalPages - 1}
                >
                    Next →
                </button>
            </div>
        </div>
    )
}