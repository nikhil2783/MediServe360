import { useState ,useEffect} from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
export default function UpdateNotification(){
    const {id}=useParams();
    const navigate=useNavigate();
    let [message,setMessage]=useState("");
    let [category,setCategory]=useState("");
    let [status,setStatus]=useState("");
    
    const messageHandler=(event)=>{
        setMessage(event.target.value)
    }

    const categoryHandler=(event)=>{
        setCategory(event.target.value)
    }

    const statusHandler=(event)=>{
        setStatus(event.target.value)
    }

    async function findById(){
        
            let url=`http://localhost:9002/notification/findNotificationById/${id}`;
        try{

            let res=await axios.get(url);
            setMessage(res.data.message);
            setCategory(res.data.category);
            setStatus(res.data.status);

        }catch(err){
            toast.error(err.message)
        }
    }

    useEffect(()=>{
        findById();
    },[])
    async function submitHandler(event){
        event.preventDefault();
        let date=new Date();
        let data={
                
                "notification": {
                    "notificationId":id,
                    "message": message,
                    "category": category,
                    "status": status,
                    "createdDate": date,
                        "user": {
                        "userId": 5,
                        "userName": "Raghu Vardhan",
                        "userRole": "Patient",
                        "userEmail": "r@gmail.com",
                        "userPhone": "123456"
                        }
  }
                
            }
        try{
            let res=await axios.put("http://localhost:9002/notification/updatenotification",data,{
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
            toast.success(res.data.message);
            navigate("/notification")
        }catch(err){
            toast.error(err.message);
        }
    }
    return(
        <div>
            <form onSubmit={submitHandler}>
                <p>Notification id is {id}</p>

                <label>Message</label>
                <input type="text" value={message} placeholder="Enter message" onChange={messageHandler} />
                <br></br>

                <label>Category</label>
                <input type="text" value={category} placeholder="Enter category" onChange={categoryHandler} />
                <br></br>

                <label>Status</label>
                <input type="text" value={status} placeholder="Enter status" onChange={statusHandler} />
                <br></br>

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}