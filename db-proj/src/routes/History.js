import { Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


function History(){

    const [hist, setHist] = useState([]);

    const navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem("logged") === null){
            alert("You are not logged in!")
            navigate("/")
        }
        if(localStorage.getItem("logged")){
            fetch('/history', {
                'method': 'POST',
                headers: {
                  'Content-Type': 'application/json'    // Send/Recieves JSON information
                },
                body:JSON.stringify({tid: localStorage.getItem('tid')} )   // Send JSON-ified username
              })
              .then(res => res.json())    // Recieve data from server and set response hook
              .then(res => setHist(res.logs))
              .catch(error => console.log('error', error))
        }
    }, []);    

    return (
        <div>
            <h1>History</h1>
                <table>
                    <thead>
                        <th> Transaction ID </th>
                        <th> Type of Transaction </th>
                        <th> Date/Time </th>
                        <th> Description </th>
                    </thead>
                    <tbody>
                    {hist.map((hist_info) =>(
                        <tr>
                        <td>{hist_info.Transaction_ID}</td>
                        <td>{hist_info.Transaction_Type}</td>
                        <td>{hist_info.Time_Date}</td>
                        <td>{hist_info.Description}</td>
                    </tr>
                    ))}    
                </tbody>
                </table>
        </div>
    );
};

export default History;